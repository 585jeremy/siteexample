<?php
require __DIR__ . '/bootstrap.php';

if (session_status() === PHP_SESSION_ACTIVE) {
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        staff_auth_expire_session_cookie();
    }

    session_destroy();
}

staff_auth_send_json([
    'configured' => staff_auth_is_configured(),
    'ok' => true,
    'authenticated' => false,
]);
