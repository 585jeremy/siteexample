<?php
require __DIR__ . '/bootstrap.php';

$homeUrl = auth_config('site_home_url', 'https://sgcnr.net/#/');
$returnTo = trim((string) ($_GET['return_to'] ?? ''));

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    auth_expire_session_cookie();
}

session_destroy();

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Location: ' . ($returnTo && auth_is_allowed_redirect($returnTo) ? $returnTo : $homeUrl));
exit;
