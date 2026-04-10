<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../backend/bot-bridge.php';

$snapshot = api_read_snapshot();
$botPdo = sgcnr_bot_bridge_connect('api_config');
if ($botPdo instanceof PDO) {
    $snapshot = sgcnr_bot_bridge_enrich_live_snapshot($snapshot, $botPdo);
}

api_json($snapshot);
