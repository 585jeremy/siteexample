<?php
require __DIR__ . '/bootstrap.php';

$clientId = auth_config('discord_client_id', '');
$clientSecret = auth_config('discord_client_secret', '');
$redirectUri = auth_config('discord_redirect_uri', '');
$guildId = auth_config('discord_guild_id', '');
$staffGuildId = auth_config('discord_staff_guild_id', '');
$siteHomeUrl = auth_config('site_home_url', 'https://sgcnr.net/#/');
$returnTo = trim((string) ($_SESSION['oauth_return_to'] ?? ''));

if (!auth_has_minimum_config() || !$clientId || !$clientSecret || !$redirectUri) {
    http_response_code(500);
    die('Discord auth config is incomplete.');
}

if (!isset($_GET['code']) || !isset($_GET['state']) || $_GET['state'] !== ($_SESSION['oauth_state'] ?? '')) {
    http_response_code(400);
    die('Invalid OAuth state.');
}

$tokenData = auth_discord_request('https://discord.com/api/oauth2/token', 'POST', [
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'grant_type' => 'authorization_code',
    'code' => $_GET['code'],
    'redirect_uri' => $redirectUri,
]);

if (!isset($tokenData['access_token'])) {
    http_response_code(500);
    die('Failed to get access token.');
}

$accessToken = $tokenData['access_token'];

$user = auth_discord_request('https://discord.com/api/users/@me', 'GET', null, $accessToken);
if (!isset($user['id'])) {
    http_response_code(500);
    die('Failed to get user info.');
}

function auth_fetch_member_for_guild(string $guildId, string $accessToken): array
{
    if ($guildId === '') {
        return [];
    }

    return auth_discord_request(
        'https://discord.com/api/users/@me/guilds/' . rawurlencode($guildId) . '/member',
        'GET',
        null,
        $accessToken
    );
}

$member = auth_fetch_member_for_guild($guildId, $accessToken);
$staffMember = [];
if ($staffGuildId === '' || $staffGuildId === $guildId) {
    $staffMember = $member;
} elseif ($staffGuildId !== '') {
    $staffMember = $staffGuildId === $guildId
        ? $member
        : auth_fetch_member_for_guild($staffGuildId, $accessToken);
}

$roles = $member['roles'] ?? [];
$staffRoles = $staffMember['roles'] ?? [];
$guildNick = $member['nick'] ?? ($user['global_name'] ?? $user['username']);
$displayName = $user['global_name'] ?? $user['username'];
$avatarHash = $user['avatar'] ?? null;
$avatarUrl = $avatarHash
    ? 'https://cdn.discordapp.com/avatars/' . rawurlencode($user['id']) . '/' . rawurlencode($avatarHash) . '.png?size=256'
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

session_regenerate_id(true);

$_SESSION['discord_id'] = $user['id'];
$_SESSION['discord_username'] = $user['username'];
$_SESSION['discord_display_name'] = $displayName;
$_SESSION['discord_guild_nick'] = $guildNick;
$_SESSION['discord_avatar_hash'] = $avatarHash;
$_SESSION['discord_avatar_url'] = $avatarUrl;
$_SESSION['discord_roles'] = $roles;
$_SESSION['discord_public_guild_id'] = $guildId;
$_SESSION['discord_public_member_found'] = isset($member['roles']);
$_SESSION['discord_staff_guild_id'] = $staffGuildId !== '' ? $staffGuildId : $guildId;
$_SESSION['discord_staff_member_found'] = isset($staffMember['roles']);
$_SESSION['discord_staff_roles'] = $staffRoles;
$_SESSION['logged_in'] = true;
$_SESSION['last_verified_at'] = gmdate('c');
unset($_SESSION['oauth_state']);
unset($_SESSION['oauth_return_to']);

try {
    if (!empty(auth_config('mysql_dsn')) && !empty(auth_config('mysql_user'))) {
        $pdo = new PDO(
            auth_config('mysql_dsn'),
            auth_config('mysql_user'),
            auth_config('mysql_password', ''),
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

        $stmt = $pdo->prepare(
            'INSERT INTO web_sessions (discord_id, username, avatar, roles, last_seen)
             VALUES (?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE username = ?, avatar = ?, roles = ?, last_seen = NOW()'
        );

        $rolesJson = json_encode($roles);
        $stmt->execute([
            $user['id'],
            $user['username'],
            $avatarUrl,
            $rolesJson,
            $user['username'],
            $avatarUrl,
            $rolesJson,
        ]);
    }
} catch (Exception $e) {
    // Non-fatal: login should still succeed even if DB persistence fails.
}

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Location: ' . ($returnTo && auth_is_allowed_redirect($returnTo) ? $returnTo : $siteHomeUrl));
exit;
