<?php
require __DIR__ . '/bootstrap.php';

if (!staff_auth_is_configured()) {
    staff_auth_send_json([
        'configured' => false,
        'authenticated' => false,
        'passwordResetRequired' => false,
        'user' => null,
        'mode' => 'fallback',
    ]);
}

try {
    staff_auth_pdo();
} catch (Throwable $exception) {
    staff_auth_send_json([
        'configured' => false,
        'authenticated' => false,
        'passwordResetRequired' => false,
        'user' => null,
        'mode' => 'fallback',
        'error' => 'db_unavailable',
    ]);
}

$payload = staff_auth_session_payload();
$payload['mode'] = 'database';
staff_auth_send_json($payload);
