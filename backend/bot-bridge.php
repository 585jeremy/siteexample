<?php

declare(strict_types=1);

function sgcnr_bot_bridge_connect(callable $configResolver): ?PDO
{
    static $connections = [];

    $dsn = trim((string) $configResolver('bot_mysql_dsn', ''));
    $user = trim((string) $configResolver('bot_mysql_user', ''));
    $password = (string) $configResolver('bot_mysql_password', '');

    if ($dsn === '') {
        $dsn = trim((string) $configResolver('mysql_dsn', ''));
        $user = trim((string) $configResolver('mysql_user', ''));
        $password = (string) $configResolver('mysql_password', '');
    }

    if ($dsn === '' || $user === '') {
        return null;
    }

    $cacheKey = hash('sha256', $dsn . '|' . $user . '|' . $password);
    if (array_key_exists($cacheKey, $connections)) {
        return $connections[$cacheKey];
    }

    try {
        $connections[$cacheKey] = new PDO(
            $dsn,
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (Throwable $error) {
        $connections[$cacheKey] = null;
    }

    return $connections[$cacheKey];
}

function sgcnr_bot_bridge_timestamp_to_iso($value): string
{
    if ($value === null || $value === '') {
        return '';
    }

    if (!is_numeric($value)) {
        return '';
    }

    $timestamp = (int) $value;
    if ($timestamp > 9999999999) {
        $timestamp = (int) floor($timestamp / 1000);
    }

    if ($timestamp <= 0) {
        return '';
    }

    return gmdate('c', $timestamp);
}

function sgcnr_bot_bridge_query_count(PDO $pdo, string $sql, array $params = []): ?int
{
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $value = $stmt->fetchColumn();
        return $value === false ? null : (int) $value;
    } catch (Throwable $error) {
        return null;
    }
}

function sgcnr_bot_bridge_fetch_identity(PDO $pdo, string $discordId): array
{
    $identity = [
        'linked' => false,
        'verified' => false,
        'verificationStatus' => 'pending',
        'source' => '',
        'verifiedIdentity' => '',
        'fivemName' => '',
        'fivemLicense' => '',
        'fivemId' => '',
        'steamId' => '',
        'rockstarId' => '',
        'discordIdent' => '',
        'linkedAt' => '',
        'verifiedAt' => '',
    ];

    $discordId = trim($discordId);
    if ($discordId === '') {
        return $identity;
    }

    try {
        $playerStmt = $pdo->prepare(
            'SELECT discord_id, fivem_id, fivem_license, steam_id, rockstar_id, discord_ident, fivem_name, linked_at
             FROM players
             WHERE discord_id = ?
             LIMIT 1'
        );
        $playerStmt->execute([$discordId]);
        $player = $playerStmt->fetch(PDO::FETCH_ASSOC) ?: null;
    } catch (Throwable $error) {
        $player = null;
    }

    try {
        $verifiedStmt = $pdo->prepare(
            'SELECT discord_id, fivem_name, fivem_license, verified_at
             FROM verified
             WHERE discord_id = ?
             LIMIT 1'
        );
        $verifiedStmt->execute([$discordId]);
        $verified = $verifiedStmt->fetch(PDO::FETCH_ASSOC) ?: null;
    } catch (Throwable $error) {
        $verified = null;
    }

    if (!$player && !$verified) {
        return $identity;
    }

    $identity['linked'] = (bool) $player;
    $identity['verified'] = (bool) $verified;
    $identity['verificationStatus'] = $verified ? 'verified' : ($player ? 'linked' : 'pending');
    $identity['source'] = 'bot_database';
    $identity['verifiedIdentity'] = trim((string) ($verified['fivem_name'] ?? $player['fivem_name'] ?? ''));
    $identity['fivemName'] = trim((string) ($verified['fivem_name'] ?? $player['fivem_name'] ?? ''));
    $identity['fivemLicense'] = trim((string) ($verified['fivem_license'] ?? $player['fivem_license'] ?? ''));
    $identity['fivemId'] = trim((string) ($player['fivem_id'] ?? ''));
    $identity['steamId'] = trim((string) ($player['steam_id'] ?? ''));
    $identity['rockstarId'] = trim((string) ($player['rockstar_id'] ?? ''));
    $identity['discordIdent'] = trim((string) ($player['discord_ident'] ?? ''));
    $identity['linkedAt'] = sgcnr_bot_bridge_timestamp_to_iso($player['linked_at'] ?? null);
    $identity['verifiedAt'] = sgcnr_bot_bridge_timestamp_to_iso($verified['verified_at'] ?? null);

    return $identity;
}

function sgcnr_bot_bridge_fetch_counts(PDO $pdo): array
{
    return [
        'linkedAccounts' => sgcnr_bot_bridge_query_count($pdo, 'SELECT COUNT(*) FROM players'),
        'verifiedAccounts' => sgcnr_bot_bridge_query_count($pdo, 'SELECT COUNT(*) FROM verified'),
        'openTickets' => sgcnr_bot_bridge_query_count($pdo, "SELECT COUNT(*) FROM tickets WHERE status = 'open'"),
    ];
}

function sgcnr_bot_bridge_enrich_live_snapshot(array $snapshot, PDO $pdo): array
{
    $counts = sgcnr_bot_bridge_fetch_counts($pdo);

    if (($snapshot['discord']['linking']['linkedAccounts'] ?? null) === null && $counts['linkedAccounts'] !== null) {
        $snapshot['discord']['linking']['linkedAccounts'] = $counts['linkedAccounts'];
    }

    if (($snapshot['discord']['guild']['verifiedMembers'] ?? null) === null && $counts['verifiedAccounts'] !== null) {
        $snapshot['discord']['guild']['verifiedMembers'] = $counts['verifiedAccounts'];
    }

    if (($snapshot['discord']['support']['open_tickets'] ?? null) === null && $counts['openTickets'] !== null) {
        $snapshot['discord']['support']['open_tickets'] = $counts['openTickets'];
    }

    return $snapshot;
}
