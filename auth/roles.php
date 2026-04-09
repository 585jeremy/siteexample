<?php
require __DIR__ . '/bootstrap.php';

$scope = strtolower(trim((string) ($_GET['scope'] ?? 'public')));

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    auth_send_json([
        'linked' => false,
        'guildMember' => false,
        'roles' => [],
        'syncStatus' => 'not_authenticated',
        'verifiedAt' => null,
        'scope' => $scope,
    ]);
}

if ($scope === 'staff') {
    $staffGuildId = trim((string) auth_config('discord_staff_guild_id', ''));
    $publicGuildId = trim((string) auth_config('discord_guild_id', ''));

    if ($staffGuildId === '' || $staffGuildId === $publicGuildId) {
        $roles = $_SESSION['discord_staff_roles'] ?? ($_SESSION['discord_roles'] ?? []);
        $memberFound = array_key_exists('discord_staff_member_found', $_SESSION)
            ? (bool) ($_SESSION['discord_staff_member_found'] ?? false)
            : (bool) ($_SESSION['discord_public_member_found'] ?? true);

        auth_send_json([
            'linked' => true,
            'guildMember' => $memberFound,
            'roles' => $roles,
            'syncStatus' => $memberFound ? 'ok' : 'member_not_found',
            'verifiedAt' => $_SESSION['last_verified_at'] ?? gmdate('c'),
            'scope' => 'staff',
            'guildId' => $_SESSION['discord_public_guild_id'] ?? $publicGuildId,
        ]);
    }

    if ($staffGuildId === '') {
        auth_send_json([
            'linked' => true,
            'guildMember' => false,
            'roles' => [],
            'syncStatus' => 'staff_guild_not_configured',
            'verifiedAt' => $_SESSION['last_verified_at'] ?? gmdate('c'),
            'scope' => 'staff',
        ]);
    }

    $memberFound = (bool) ($_SESSION['discord_staff_member_found'] ?? false);

    auth_send_json([
        'linked' => true,
        'guildMember' => $memberFound,
        'roles' => $_SESSION['discord_staff_roles'] ?? [],
        'syncStatus' => $memberFound ? 'ok' : 'staff_member_not_found',
        'verifiedAt' => $_SESSION['last_verified_at'] ?? gmdate('c'),
        'scope' => 'staff',
        'guildId' => $staffGuildId,
    ]);
}

auth_send_json([
    'linked' => true,
    'guildMember' => (bool) ($_SESSION['discord_public_member_found'] ?? true),
    'roles' => $_SESSION['discord_roles'] ?? [],
    'syncStatus' => 'ok',
    'verifiedAt' => $_SESSION['last_verified_at'] ?? gmdate('c'),
    'scope' => 'public',
    'guildId' => $_SESSION['discord_public_guild_id'] ?? auth_config('discord_guild_id', ''),
]);
