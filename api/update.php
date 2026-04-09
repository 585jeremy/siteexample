<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$payload = api_request_data();
api_require_update_secret($payload);

$snapshot = api_read_snapshot();
$applied = [];

api_apply_updates($snapshot, $payload, $applied);

$snapshot['updatedAt'] = api_now_iso();
$snapshot['_meta']['lastPushAt'] = $snapshot['updatedAt'];
$snapshot['_meta']['lastKeys'] = array_values(array_unique($applied));
$snapshot['_meta']['lastSource'] = trim((string) ($payload['source'] ?? 'bot-sync'));

api_write_snapshot($snapshot);

api_json([
    'ok' => true,
    'updatedAt' => $snapshot['updatedAt'],
    'applied' => $snapshot['_meta']['lastKeys'],
]);

