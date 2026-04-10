<?php
require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../backend/bot-bridge.php';

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    auth_send_json(['authenticated' => false, 'logged_in' => false]);
}

$botIdentity = [
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

$botPdo = sgcnr_bot_bridge_connect('auth_config');
if ($botPdo instanceof PDO) {
    $botIdentity = sgcnr_bot_bridge_fetch_identity($botPdo, (string) ($_SESSION['discord_id'] ?? ''));
}

$verifiedIdentity = trim((string) ($botIdentity['verifiedIdentity'] ?? ''));
if ($verifiedIdentity === '') {
    $verifiedIdentity = (string) ($_SESSION['discord_guild_nick'] ?? ($_SESSION['discord_username'] ?? ''));
}

auth_send_json([
    'authenticated' => true,
    'logged_in' => true,
    'user' => [
        'discordId' => $_SESSION['discord_id'] ?? '',
        'discordUsername' => $_SESSION['discord_username'] ?? '',
        'discordDisplayName' => $_SESSION['discord_display_name'] ?? ($_SESSION['discord_username'] ?? ''),
        'guildNickname' => $_SESSION['discord_guild_nick'] ?? ($_SESSION['discord_username'] ?? ''),
        'discordAvatarHash' => $_SESSION['discord_avatar_hash'] ?? null,
        'discordAvatarUrl' => $_SESSION['discord_avatar_url'] ?? '',
        'verifiedIdentity' => $verifiedIdentity,
        'verificationStatus' => $botIdentity['verificationStatus'] ?? 'pending',
        'verificationSource' => $botIdentity['source'] ?? '',
        'fivemName' => $botIdentity['fivemName'] ?? '',
        'fivemLicense' => $botIdentity['fivemLicense'] ?? '',
        'fivemId' => $botIdentity['fivemId'] ?? '',
        'steamId' => $botIdentity['steamId'] ?? '',
        'rockstarId' => $botIdentity['rockstarId'] ?? '',
        'discordIdent' => $botIdentity['discordIdent'] ?? '',
        'linkedAt' => $botIdentity['linkedAt'] ?? '',
        'verifiedAt' => $botIdentity['verifiedAt'] ?? '',
        'discordLinked' => true,
        'roles' => $_SESSION['discord_roles'] ?? [],
        'staffRoles' => $_SESSION['discord_staff_roles'] ?? ($_SESSION['discord_roles'] ?? []),
    ],
]);
