<?php

declare(strict_types=1);

$configPath = __DIR__ . '/config.php';
$apiConfig = [];

if (file_exists($configPath)) {
    $loaded = require $configPath;
    if (is_array($loaded)) {
        $apiConfig = $loaded;
    }
}

function api_config(string $key, $default = null)
{
    global $apiConfig;
    return $apiConfig[$key] ?? $default;
}

function api_json(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function api_now_iso(): string
{
    return gmdate('c');
}

function api_is_assoc(array $value): bool
{
    if ($value === []) {
        return false;
    }

    return array_keys($value) !== range(0, count($value) - 1);
}

function api_merge_snapshot(array $base, array $override): array
{
    foreach ($override as $key => $value) {
        if (is_array($value) && isset($base[$key]) && is_array($base[$key]) && api_is_assoc($value) && api_is_assoc($base[$key])) {
            $base[$key] = api_merge_snapshot($base[$key], $value);
            continue;
        }

        $base[$key] = $value;
    }

    return $base;
}

function api_default_snapshot(): array
{
    return [
        'updatedAt' => null,
        'discord' => [
            'botStatus' => [
                'status' => 'pending',
                'message' => 'Waiting for bot sync.',
                'latencyMs' => null,
                'checkedAt' => null,
            ],
            'guild' => [
                'name' => api_config('default_guild_name', 'SGCNR'),
                'onlineMembers' => null,
                'totalMembers' => null,
                'verifiedMembers' => null,
            ],
            'support' => [
                'open_tickets' => null,
                'pending_reports' => null,
                'pendingApplications' => null,
                'supportUrl' => api_config('support_url', ''),
            ],
            'linking' => [
                'enabled' => (bool) api_config('linking_enabled', true),
                'linkedAccounts' => null,
                'syncRoles' => (bool) api_config('role_sync_enabled', true),
                'oauthUrl' => api_config('oauth_url', 'https://sgcnr.net/auth/login.php'),
            ],
            'announcements' => [],
        ],
        'leaderboard' => [
            'updatedAt' => null,
            'rows' => [],
        ],
        'game' => [
            'server' => [
                'status' => 'pending',
                'serverName' => api_config('default_server_name', 'SGCNR'),
                'onlinePlayers' => null,
                'maxPlayers' => null,
                'activeMissions' => null,
                'activeRobberies' => null,
                'activeHeists' => null,
                'uptimeSeconds' => null,
                'updatedAt' => null,
            ],
            'profiles' => [
                'updatedAt' => null,
                'rows' => [],
            ],
            'leaderboards' => [
                'updatedAt' => null,
                'boards' => [],
            ],
            'events' => [
                'updatedAt' => null,
                'rows' => [],
            ],
        ],
        'liveMap' => [
            'updatedAt' => null,
            'requiresOptIn' => (bool) api_config('live_tracking_requires_opt_in', true),
            'settingLabel' => api_config('live_tracking_label', 'Website Live Tracking'),
            'players' => [],
        ],
        'uptime' => [
            'startedAt' => null,
            'uptimeSeconds' => null,
        ],
        'restart' => [
            'nextRestartAt' => null,
            'label' => api_config('next_restart_label', 'Scheduled restart'),
        ],
        'queue' => [
            'count' => null,
            'estimatedWaitMinutes' => null,
        ],
        'counts' => [
            'cops' => null,
            'ems' => null,
            'civs' => null,
            'gangs' => null,
        ],
        'events' => [],
        'history' => [
            'uptime' => [],
            'outages' => [],
        ],
        'hotZones' => [],
        'serverHealth' => [
            'status' => 'pending',
            'message' => 'Waiting for server telemetry.',
            'latencyMs' => null,
            'checkedAt' => null,
        ],
        'websiteHealth' => [
            'status' => 'pending',
            'message' => 'Waiting for website telemetry.',
            'latencyMs' => null,
            'checkedAt' => null,
        ],
        '_meta' => [
            'version' => 1,
            'lastPushAt' => null,
            'lastKeys' => [],
            'lastSource' => '',
        ],
    ];
}

function api_resolve_path(string $path): string
{
    if ($path === '') {
        return __DIR__ . '/data/live-ops.json';
    }

    if (preg_match('/^[A-Za-z]:\\\\/', $path) === 1 || str_starts_with($path, '/') || str_starts_with($path, '\\\\')) {
        return $path;
    }

    return __DIR__ . '/' . ltrim($path, '/\\');
}

function api_storage_path(): string
{
    return api_resolve_path((string) api_config('storage_file', 'data/live-ops.json'));
}

function api_read_snapshot(): array
{
    $defaults = api_default_snapshot();
    $path = api_storage_path();

    if (!file_exists($path)) {
        return $defaults;
    }

    $raw = file_get_contents($path);
    if ($raw === false || trim($raw) === '') {
        return $defaults;
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return $defaults;
    }

    return api_merge_snapshot($defaults, $decoded);
}

function api_write_snapshot(array $snapshot): void
{
    $path = api_storage_path();
    $directory = dirname($path);

    if (!is_dir($directory)) {
        mkdir($directory, 0775, true);
    }

    file_put_contents(
        $path,
        json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
    );
}

function api_to_number($value)
{
    if ($value === '' || $value === null) {
        return null;
    }

    if (is_bool($value)) {
        return $value ? 1 : 0;
    }

    if (!is_numeric($value)) {
        return null;
    }

    return strpos((string) $value, '.') !== false ? (float) $value : (int) $value;
}

function api_to_bool($value): ?bool
{
    if ($value === null || $value === '') {
        return null;
    }

    if (is_bool($value)) {
        return $value;
    }

    $normalized = strtolower(trim((string) $value));
    if (in_array($normalized, ['1', 'true', 'yes', 'on'], true)) {
        return true;
    }

    if (in_array($normalized, ['0', 'false', 'no', 'off'], true)) {
        return false;
    }

    return null;
}

function api_request_data(): array
{
    $contentType = strtolower(trim((string) ($_SERVER['CONTENT_TYPE'] ?? '')));
    $body = file_get_contents('php://input') ?: '';
    $payload = [];

    if (str_contains($contentType, 'application/json') && trim($body) !== '') {
        $decoded = json_decode($body, true);
        if (is_array($decoded)) {
            $payload = $decoded;
        }
    }

    if (!$payload && !empty($_POST)) {
        $payload = $_POST;
    }

    if (!$payload && trim($body) !== '') {
        parse_str($body, $parsed);
        if (is_array($parsed) && $parsed !== []) {
            $payload = $parsed;
        }
    }

    if (!empty($_GET)) {
        $payload = array_merge($_GET, $payload);
    }

    return is_array($payload) ? $payload : [];
}

function api_request_secret(array $payload): string
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $headerSecret = $headers['X-API-SECRET'] ?? $headers['x-api-secret'] ?? $headers['X-WEB-API-SECRET'] ?? $headers['x-web-api-secret'] ?? '';

    if (is_string($headerSecret) && trim($headerSecret) !== '') {
        return trim($headerSecret);
    }

    $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (is_string($authorization) && preg_match('/^Bearer\s+(.+)$/i', trim($authorization), $matches) === 1) {
        return trim($matches[1]);
    }

    foreach (['secret', 'token', 'web_api_secret', 'api_secret'] as $key) {
        if (!empty($payload[$key])) {
            return trim((string) $payload[$key]);
        }
    }

    return '';
}

function api_require_update_secret(array $payload): void
{
    $configuredSecret = trim((string) api_config('web_api_secret', ''));
    if ($configuredSecret === '') {
        api_json([
            'ok' => false,
            'error' => 'web_api_secret_not_configured',
        ], 500);
    }

    $providedSecret = api_request_secret($payload);
    if ($providedSecret === '' || !hash_equals($configuredSecret, $providedSecret)) {
        api_json([
            'ok' => false,
            'error' => 'invalid_secret',
        ], 403);
    }
}

function api_apply_health_update(array &$target, $value, string $defaultMessage): void
{
    if (is_array($value)) {
        $target = api_merge_snapshot($target, $value);
    } elseif (is_string($value)) {
        $target['status'] = trim($value) !== '' ? trim($value) : ($target['status'] ?? 'pending');
        $target['message'] = $target['message'] ?? $defaultMessage;
    }

    if (empty($target['checkedAt'])) {
        $target['checkedAt'] = api_now_iso();
    }
}

function api_apply_named_update(array &$snapshot, string $key, $value, array &$applied): void
{
    $normalized = strtolower(trim($key));
    if ($normalized === '') {
        return;
    }

    switch ($normalized) {
        case 'bot_status':
            $snapshot['discord']['botStatus']['status'] = (string) $value;
            $snapshot['discord']['botStatus']['checkedAt'] = api_now_iso();
            $applied[] = 'bot_status';
            return;

        case 'bot_latency':
            $snapshot['discord']['botStatus']['latencyMs'] = api_to_number($value);
            $snapshot['discord']['botStatus']['checkedAt'] = api_now_iso();
            $applied[] = 'bot_latency';
            return;

        case 'bot_message':
            $snapshot['discord']['botStatus']['message'] = (string) $value;
            $snapshot['discord']['botStatus']['checkedAt'] = api_now_iso();
            $applied[] = 'bot_message';
            return;

        case 'guild_name':
            $snapshot['discord']['guild']['name'] = (string) $value;
            $applied[] = 'guild_name';
            return;

        case 'total_members':
            $snapshot['discord']['guild']['totalMembers'] = api_to_number($value);
            $applied[] = 'total_members';
            return;

        case 'online_members':
            $snapshot['discord']['guild']['onlineMembers'] = api_to_number($value);
            $applied[] = 'online_members';
            return;

        case 'verified_members':
            $snapshot['discord']['guild']['verifiedMembers'] = api_to_number($value);
            $applied[] = 'verified_members';
            return;

        case 'open_tickets':
            $snapshot['discord']['support']['open_tickets'] = api_to_number($value);
            $applied[] = 'open_tickets';
            return;

        case 'pending_reports':
            $snapshot['discord']['support']['pending_reports'] = api_to_number($value);
            $applied[] = 'pending_reports';
            return;

        case 'pending_applications':
            $snapshot['discord']['support']['pendingApplications'] = api_to_number($value);
            $applied[] = 'pending_applications';
            return;

        case 'linked_accounts':
            $snapshot['discord']['linking']['linkedAccounts'] = api_to_number($value);
            $applied[] = 'linked_accounts';
            return;

        case 'sync_roles':
        case 'role_sync':
            $bool = api_to_bool($value);
            if ($bool !== null) {
                $snapshot['discord']['linking']['syncRoles'] = $bool;
            }
            $applied[] = $normalized;
            return;

        case 'linking_enabled':
            $bool = api_to_bool($value);
            if ($bool !== null) {
                $snapshot['discord']['linking']['enabled'] = $bool;
            }
            $applied[] = 'linking_enabled';
            return;

        case 'oauth_url':
            $snapshot['discord']['linking']['oauthUrl'] = (string) $value;
            $applied[] = 'oauth_url';
            return;

        case 'support_url':
            $snapshot['discord']['support']['supportUrl'] = (string) $value;
            $applied[] = 'support_url';
            return;

        case 'queue_count':
            $snapshot['queue']['count'] = api_to_number($value);
            $applied[] = 'queue_count';
            return;

        case 'queue_estimated_wait_minutes':
            $snapshot['queue']['estimatedWaitMinutes'] = api_to_number($value);
            $applied[] = 'queue_estimated_wait_minutes';
            return;

        case 'uptime_seconds':
            $snapshot['uptime']['uptimeSeconds'] = api_to_number($value);
            $applied[] = 'uptime_seconds';
            return;

        case 'uptime_started_at':
            $snapshot['uptime']['startedAt'] = (string) $value;
            $applied[] = 'uptime_started_at';
            return;

        case 'next_restart_at':
            $snapshot['restart']['nextRestartAt'] = (string) $value;
            $applied[] = 'next_restart_at';
            return;

        case 'restart_label':
            $snapshot['restart']['label'] = (string) $value;
            $applied[] = 'restart_label';
            return;

        case 'server_health':
            api_apply_health_update($snapshot['serverHealth'], $value, 'Server telemetry updated.');
            $applied[] = 'server_health';
            return;

        case 'website_health':
            api_apply_health_update($snapshot['websiteHealth'], $value, 'Website telemetry updated.');
            $applied[] = 'website_health';
            return;

        case 'leaderboard':
            if (is_array($value)) {
                $snapshot['leaderboard'] = api_merge_snapshot($snapshot['leaderboard'], $value);
                if (empty($snapshot['leaderboard']['updatedAt'])) {
                    $snapshot['leaderboard']['updatedAt'] = api_now_iso();
                }
                $applied[] = 'leaderboard';
            }
            return;

        case 'game_status':
            $snapshot['game']['server']['status'] = (string) $value;
            $snapshot['game']['server']['updatedAt'] = api_now_iso();
            $applied[] = 'game_status';
            return;

        case 'online_players':
            $snapshot['game']['server']['onlinePlayers'] = api_to_number($value);
            $snapshot['game']['server']['updatedAt'] = api_now_iso();
            $applied[] = 'online_players';
            return;

        case 'max_players':
            $snapshot['game']['server']['maxPlayers'] = api_to_number($value);
            $snapshot['game']['server']['updatedAt'] = api_now_iso();
            $applied[] = 'max_players';
            return;

        case 'active_missions':
            $snapshot['game']['server']['activeMissions'] = api_to_number($value);
            $snapshot['game']['server']['updatedAt'] = api_now_iso();
            $applied[] = 'active_missions';
            return;

        case 'active_robberies':
            $snapshot['game']['server']['activeRobberies'] = api_to_number($value);
            $snapshot['game']['server']['updatedAt'] = api_now_iso();
            $applied[] = 'active_robberies';
            return;

        case 'active_heists':
            $snapshot['game']['server']['activeHeists'] = api_to_number($value);
            $snapshot['game']['server']['updatedAt'] = api_now_iso();
            $applied[] = 'active_heists';
            return;

        case 'server_uptime_seconds':
            $snapshot['game']['server']['uptimeSeconds'] = api_to_number($value);
            $snapshot['game']['server']['updatedAt'] = api_now_iso();
            $applied[] = 'server_uptime_seconds';
            return;

        case 'game_profiles':
            if (is_array($value)) {
                $snapshot['game']['profiles']['rows'] = $value;
                $snapshot['game']['profiles']['updatedAt'] = api_now_iso();
                $applied[] = 'game_profiles';
            }
            return;

        case 'game_leaderboards':
            if (is_array($value)) {
                $snapshot['game']['leaderboards']['boards'] = $value;
                $snapshot['game']['leaderboards']['updatedAt'] = api_now_iso();
                $applied[] = 'game_leaderboards';
            }
            return;

        case 'game_events':
            if (is_array($value)) {
                $snapshot['game']['events']['rows'] = $value;
                $snapshot['game']['events']['updatedAt'] = api_now_iso();
                $applied[] = 'game_events';
            }
            return;

        case 'announcements':
            if (is_array($value)) {
                $snapshot['discord']['announcements'] = $value;
                $applied[] = 'announcements';
            }
            return;

        case 'live_map':
        case 'livemap':
            if (is_array($value)) {
                $snapshot['liveMap'] = api_merge_snapshot($snapshot['liveMap'], $value);
                if (empty($snapshot['liveMap']['updatedAt'])) {
                    $snapshot['liveMap']['updatedAt'] = api_now_iso();
                }
                $applied[] = 'live_map';
            }
            return;
    }
}

function api_apply_updates(array &$snapshot, array $payload, array &$applied): void
{
    if (isset($payload['payload']) && is_array($payload['payload'])) {
        api_apply_updates($snapshot, $payload['payload'], $applied);
    }

    if (isset($payload['updates'])) {
        if (is_array($payload['updates']) && api_is_assoc($payload['updates'])) {
            foreach ($payload['updates'] as $key => $value) {
                api_apply_named_update($snapshot, (string) $key, $value, $applied);
            }
        } elseif (is_array($payload['updates'])) {
            foreach ($payload['updates'] as $update) {
                if (is_array($update) && isset($update['key'])) {
                    api_apply_named_update($snapshot, (string) $update['key'], $update['value'] ?? null, $applied);
                }
            }
        }
    }

    if (isset($payload['key'])) {
        api_apply_named_update($snapshot, (string) $payload['key'], $payload['value'] ?? null, $applied);
    }

    $reservedKeys = ['secret', 'token', 'web_api_secret', 'api_secret', 'payload', 'updates', 'key', 'value', 'source'];
    foreach ($payload as $key => $value) {
        if (in_array($key, $reservedKeys, true)) {
            continue;
        }

        api_apply_named_update($snapshot, (string) $key, $value, $applied);
    }

    $sectionMap = [
        'discord',
        'leaderboard',
        'game',
        'liveMap',
        'uptime',
        'restart',
        'queue',
        'counts',
        'events',
        'history',
        'hotZones',
        'serverHealth',
        'websiteHealth',
    ];

    foreach ($sectionMap as $key) {
        if (!isset($payload[$key])) {
            continue;
        }

        $value = $payload[$key];
        if (!is_array($value)) {
            continue;
        }

        $snapshot[$key] = api_merge_snapshot($snapshot[$key], $value);
        $applied[] = $key;
    }

    if (isset($payload['announcements']) && is_array($payload['announcements'])) {
        $snapshot['discord']['announcements'] = $payload['announcements'];
        $applied[] = 'announcements';
    }

    if (isset($payload['players']) && is_array($payload['players']) && !isset($payload['liveMap'])) {
        $snapshot['liveMap']['players'] = $payload['players'];
        $snapshot['liveMap']['updatedAt'] = api_now_iso();
        $applied[] = 'players';
    }
}

function api_db_connect(string $dsnKey, string $userKey, string $passwordKey): ?PDO
{
    $dsn = trim((string) api_config($dsnKey, ''));
    $user = (string) api_config($userKey, '');
    $password = (string) api_config($passwordKey, '');

    if ($dsn === '') {
        return null;
    }

    try {
        return new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $error) {
        return null;
    }
}
