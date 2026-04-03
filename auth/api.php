<?php
require __DIR__ . '/bootstrap.php';

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    auth_send_json(['authenticated' => false, 'logged_in' => false]);
}

auth_send_json([
    'authenticated' => true,
    'logged_in' => true,
    'user' => [
        'discordId' => $_SESSION['discord_id'] ?? '',
        'discordUsername' => $_SESSION['discord_username'] ?? '',
        'discordDisplayName' => $_SESSION['discord_display_name'] ?? ($_SESSION['discord_username'] ?? ''),
        'guildNickname' => $_SESSION['discord_guild_nick'] ?? ($_SESSION['discord_username'] ?? ''),
        'discordAvatarHash' => $_SESSION['discord_avatar_hash'] ?? null,
        'discordAvatarUrl' => $_SESSION['discord_avatar_url'] ?? '',
        'verifiedIdentity' => $_SESSION['discord_guild_nick'] ?? ($_SESSION['discord_username'] ?? ''),
        'discordLinked' => true,
        'roles' => $_SESSION['discord_roles'] ?? [],
    ],
]);
