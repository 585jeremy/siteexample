<?php
require __DIR__ . '/bootstrap.php';

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    auth_send_json([
        'linked' => false,
        'guildMember' => false,
        'roles' => [],
        'syncStatus' => 'not_authenticated',
        'verifiedAt' => null,
    ]);
}

auth_send_json([
    'linked' => true,
    'guildMember' => true,
    'roles' => $_SESSION['discord_roles'] ?? [],
    'syncStatus' => 'ok',
    'verifiedAt' => $_SESSION['last_verified_at'] ?? gmdate('c'),
]);
