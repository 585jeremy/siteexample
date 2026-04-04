<?php
require __DIR__ . '/bootstrap.php';

if (session_status() === PHP_SESSION_ACTIVE) {
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}

staff_auth_send_json([
    'configured' => staff_auth_is_configured(),
    'ok' => true,
    'authenticated' => false,
]);
