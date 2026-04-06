<?php
require __DIR__ . '/bootstrap.php';

staff_auth_require_login();

$configuredBaseUrl = staff_auth_txadmin_base_url();
$baseUrl = $configuredBaseUrl !== '' ? $configuredBaseUrl : 'http://185.223.30.214:30583';
$accessLevel = staff_auth_access_level();
$bridgeEnabled = staff_auth_bool_config('txadmin_bridge_enabled', false);
$consoleManagerOnly = staff_auth_bool_config('txadmin_console_manager_only', true);
$baseConfigured = $configuredBaseUrl !== '';
$baseAvailable = $baseUrl !== '';
$requestIsSecure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
$mixedContentWarning = $baseAvailable && $requestIsSecure && stripos($baseUrl, 'http://') === 0;

if (!in_array($accessLevel, ['manager', 'admin'], true)) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'authorized' => false,
        'accessLevel' => $accessLevel,
        'error' => 'insufficient_access',
    ], 403);
}

$links = [
    'home' => $baseAvailable ? $baseUrl . '/' : '',
    'players' => $baseAvailable ? $baseUrl . '/login?r=%2Fplayers' : '',
    'console' => $baseAvailable && (!$consoleManagerOnly || $accessLevel === 'manager')
        ? $baseUrl . '/login?r=%2Fconsole'
        : '',
];

$capabilities = [];
if ($baseAvailable) {
    $capabilities[] = 'launch';
    $capabilities[] = 'players';
}
if ($bridgeEnabled) {
    $capabilities[] = 'bridge_status';
    $capabilities[] = 'bridge_resources';
    $capabilities[] = 'bridge_players';
}
if ($accessLevel === 'manager') {
    $capabilities[] = 'console';
}

$notes = [];
if (!$baseConfigured) {
    $notes[] = 'txAdmin is using the current site fallback URL. Move it into staff-auth/config.php later so the bridge setup stays explicit.';
}
if ($mixedContentWarning) {
    $notes[] = 'txAdmin is currently using http://, so the staff site should keep opening it in a new tab until the secure backend bridge is added.';
}
if (!$bridgeEnabled) {
    $notes[] = 'The in-portal txAdmin bridge is still prepared only. Add secrets later on the backend, not in the browser.';
}
if ($accessLevel === 'manager') {
    $notes[] = 'Manager access is ready for the future secure console bridge.';
} elseif ($accessLevel === 'admin') {
    $notes[] = 'Admin access is prepared for read-only runtime data and player overview once the bridge is live.';
} else {
    $notes[] = 'This staff account can sign in, but txAdmin tooling is still reserved for manager and admin paths.';
}

staff_auth_send_json([
    'configured' => true,
    'ok' => true,
    'authorized' => true,
    'accessLevel' => $accessLevel,
    'bridgeEnabled' => $bridgeEnabled,
    'baseUrlConfigured' => $baseConfigured,
    'mixedContentWarning' => $mixedContentWarning,
    'links' => $links,
    'capabilities' => array_values(array_unique($capabilities)),
    'notes' => $notes,
]);
