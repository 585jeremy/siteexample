<?php

return [
    // Shared secret used by the Discord bot / bridge when POSTing to api/update.php.
    'web_api_secret' => 'CHANGE_ME',

    // Optional custom storage path. Relative paths resolve from the /api folder.
    'storage_file' => 'data/live-ops.json',

    // Optional: separate Discord bot DB used for ticket and verification fallback counts.
    // Leave blank when the bot tables live in the same DB as the website API DB.
    'bot_mysql_dsn' => '',
    'bot_mysql_user' => '',
    'bot_mysql_password' => '',

    // Optional: game/profile database used for player profiles and leaderboards.
    'game_mysql_dsn' => '',
    'game_mysql_user' => '',
    'game_mysql_password' => '',

    // Defaults used by api/live-ops.php before the first successful bot push.
    'default_guild_name' => 'SGCNR',
    'default_server_name' => 'SGCNR',
    'linking_enabled' => true,
    'role_sync_enabled' => true,
    'oauth_url' => 'https://sgcnr.net/auth/login.php',
    'support_url' => 'https://discord.gg/Y8HNFPtxkE',
    'next_restart_label' => 'Scheduled restart',
    'live_tracking_requires_opt_in' => true,
    'live_tracking_label' => 'Website Live Tracking',
];
