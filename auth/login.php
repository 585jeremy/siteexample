<?php
require __DIR__ . '/bootstrap.php';

$clientId = auth_config('discord_client_id', '');
$redirectUri = auth_config('discord_redirect_uri', '');
$returnTo = trim((string) ($_GET['return_to'] ?? ''));

if (!auth_has_minimum_config() || !$clientId || !$redirectUri) {
    http_response_code(500);
    die('Discord auth config is incomplete.');
}

$state = bin2hex(random_bytes(16));
$_SESSION['oauth_state'] = $state;
if ($returnTo && auth_is_allowed_redirect($returnTo)) {
    $_SESSION['oauth_return_to'] = $returnTo;
} else {
    unset($_SESSION['oauth_return_to']);
}

$params = http_build_query([
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => 'identify guilds.members.read',
    'state' => $state,
    'prompt' => 'consent',
]);

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Location: https://discord.com/oauth2/authorize?' . $params);
exit;
