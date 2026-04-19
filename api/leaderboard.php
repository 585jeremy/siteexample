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

$allowedBoards = [
    'money' => 's.bank_money + s.cash_money',
    'playtime' => 's.playtime_minutes',
    'kd' => 's.kd_ratio',
    'kills' => 's.kills',
    'arrests' => 's.arrests',
    'bank_heists' => 's.bank_heists',
];

$board = strtolower(trim((string) ($_GET['type'] ?? 'money')));
$limit = max(1, min(50, (int) ($_GET['limit'] ?? 10)));

if (!isset($allowedBoards[$board])) {
    api_json([
        'configured' => true,
        'error' => 'invalid_board',
        'availableBoards' => array_keys($allowedBoards),
    ], 400);
}

$expression = $allowedBoards[$board];
$sql = <<<SQL
SELECT
  p.license_primary,
  p.display_name,
  p.character_name,
  {$expression} AS stat_value
FROM game_player_profiles p
INNER JOIN game_player_stats s ON s.player_id = p.id
WHERE p.profile_visibility IN ('public', 'login')
ORDER BY stat_value DESC, p.updated_at DESC
LIMIT {$limit}
SQL;

$statement = $pdo->query($sql);
$rows = [];
$rank = 1;

foreach ($statement->fetchAll() as $row) {
    $rows[] = [
        'rank' => $rank++,
        'license' => $row['license_primary'],
        'displayName' => $row['display_name'],
        'characterName' => $row['character_name'],
        'value' => api_to_number($row['stat_value']),
    ];
}

api_json([
    'configured' => true,
    'type' => $board,
    'rows' => $rows,
]);
