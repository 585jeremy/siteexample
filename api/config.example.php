<?php

return [
    // Shared secret used by the Discord bot / bridge when POSTing to api/update.php.
    'web_api_secret' => 'CHANGE_ME',

    // Optional custom storage path. Relative paths resolve from the /api folder.
    'storage_file' => 'data/live-ops.json',

    // Defaults used by api/live-ops.php before the first successful bot push.
    'default_guild_name' => 'SGCNR',
    'linking_enabled' => true,
    'role_sync_enabled' => true,
    'oauth_url' => 'https://sgcnr.net/auth/login.php',
    'support_url' => 'https://discord.gg/Y8HNFPtxkE',
    'next_restart_label' => 'Scheduled restart',
    'live_tracking_requires_opt_in' => true,
    'live_tracking_label' => 'Website Live Tracking',
];

