<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$pdo = api_db_connect('game_mysql_dsn', 'game_mysql_user', 'game_mysql_password');
if (!$pdo instanceof PDO) {
    api_json([
        'configured' => false,
        'error' => 'game_database_not_configured',
    ], 503);
}

$identifier = trim((string) ($_GET['id'] ?? $_GET['license'] ?? $_GET['discordId'] ?? $_GET['citizenId'] ?? ''));
if ($identifier === '') {
    api_json([
        'configured' => true,
        'error' => 'missing_identifier',
    ], 400);
}

$sql = <<<SQL
SELECT
  p.license_primary,
  p.citizen_id,
  p.discord_id,
  p.steam_id,
  p.rockstar_id,
  p.character_name,
  p.display_name,
  p.avatar_url,
  p.profile_visibility,
  p.is_online,
  p.first_seen_at,
  p.last_seen_at,
  p.updated_at,
  s.cash_money,
  s.bank_money,
  s.playtime_minutes,
  s.kills,
  s.deaths,
  s.kd_ratio,
  s.arrests,
  s.bank_heists,
  s.missions_completed,
  s.warnings
FROM game_player_profiles p
LEFT JOIN game_player_stats s ON s.player_id = p.id
WHERE p.license_primary = :exact
   OR p.discord_id = :exact
   OR p.citizen_id = :exact
   OR p.display_name = :exact
LIMIT 1
SQL;

$statement = $pdo->prepare($sql);
$statement->execute(['exact' => $identifier]);
$row = $statement->fetch();

if (!is_array($row)) {
    api_json([
        'configured' => true,
        'found' => false,
    ], 404);
}

api_json([
    'configured' => true,
    'found' => true,
    'profile' => [
        'license' => $row['license_primary'],
        'citizenId' => $row['citizen_id'],
        'discordId' => $row['discord_id'],
        'steamId' => $row['steam_id'],
        'rockstarId' => $row['rockstar_id'],
        'characterName' => $row['character_name'],
        'displayName' => $row['display_name'],
        'avatarUrl' => $row['avatar_url'],
        'visibility' => $row['profile_visibility'],
        'isOnline' => (bool) $row['is_online'],
        'firstSeenAt' => $row['first_seen_at'],
        'lastSeenAt' => $row['last_seen_at'],
        'updatedAt' => $row['updated_at'],
        'stats' => [
            'cashMoney' => api_to_number($row['cash_money']),
            'bankMoney' => api_to_number($row['bank_money']),
            'playtimeMinutes' => api_to_number($row['playtime_minutes']),
            'kills' => api_to_number($row['kills']),
            'deaths' => api_to_number($row['deaths']),
            'kdRatio' => api_to_number($row['kd_ratio']),
            'arrests' => api_to_number($row['arrests']),
            'bankHeists' => api_to_number($row['bank_heists']),
            'missionsCompleted' => api_to_number($row['missions_completed']),
            'warnings' => api_to_number($row['warnings']),
        ],
    ],
]);
