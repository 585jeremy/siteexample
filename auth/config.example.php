<?php

return [
    'discord_client_id' => 'YOUR_DISCORD_CLIENT_ID',
    'discord_client_secret' => 'YOUR_DISCORD_CLIENT_SECRET',
    'discord_redirect_uri' => 'https://sgcnr.net/auth/callback.php',
    'discord_guild_id' => 'YOUR_DISCORD_GUILD_ID',
    // Optional: only set this if staff roles live in a separate Discord server.
    'discord_staff_guild_id' => '',
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
    // Optional: separate Discord bot DB used for bot-side verification, player links, and tickets.
    // Leave blank when the bot tables live in the same DB as the website auth tables.
    'bot_mysql_dsn' => '',
    'bot_mysql_user' => '',
    'bot_mysql_password' => '',
    // Optional: point both the public site and staff portal at the same shared applications DB.
    'applications_mysql_dsn' => '',
    'applications_mysql_user' => '',
    'applications_mysql_password' => '',
    // Optional: Discord webhook that should receive new application / applicant reply alerts.
    'applications_discord_webhook_url' => '',
    'applications_staff_portal_url' => 'https://staff.sgcnr.net/#/applications',
];
