<?php

return [
    'discord_client_id' => 'YOUR_DISCORD_CLIENT_ID',
    'discord_client_secret' => 'YOUR_DISCORD_CLIENT_SECRET',
    'discord_redirect_uri' => 'https://sgcnr.net/auth/callback.php',
    'discord_guild_id' => 'YOUR_DISCORD_GUILD_ID',
    'site_home_url' => 'https://sgcnr.net/',
    'allowed_origin' => 'https://sgcnr.net',
    'allowed_origins' => [
        'https://sgcnr.net',
        'https://staff.sgcnr.net',
        'https://admin.sgcnr.net',
        'https://support.sgcnr.net',
        'https://testing.sgcnr.net',
    ],
    'session_cookie_path' => '/',
    'session_cookie_domain' => 'sgcnr.net',
    'session_cookie_secure' => true,
    'session_cookie_samesite' => 'Lax',
    'mysql_dsn' => 'mysql:host=localhost;dbname=your_db;charset=utf8mb4',
    'mysql_user' => 'your_db_user',
    'mysql_password' => 'your_db_password',
];
