<?php

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    die('Missing auth/config.php');
}

$config = require $configPath;
if (!is_array($config)) {
    http_response_code(500);
    die('Invalid auth/config.php');
}

$defaultSecure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
$sessionCookiePath = $config['session_cookie_path'] ?? '/';
$sessionCookieDomain = $config['session_cookie_domain'] ?? '';
$sessionCookieSecure = array_key_exists('session_cookie_secure', $config)
    ? (bool) $config['session_cookie_secure']
    : $defaultSecure;
$sessionCookieSameSite = $config['session_cookie_samesite'] ?? 'Lax';
$defaultSessionCookieLifetime = 60 * 60 * 24 * 30;
$sessionCookieLifetime = (int) ($config['session_cookie_lifetime'] ?? $defaultSessionCookieLifetime);
if ($sessionCookieLifetime < 0) {
    $sessionCookieLifetime = 0;
}

function auth_allowed_origins(): array
{
    $origins = [];

    $configuredList = auth_config('allowed_origins', []);
    if (is_string($configuredList) && $configuredList !== '') {
        $configuredList = array_map('trim', explode(',', $configuredList));
    }

    if (is_array($configuredList)) {
        foreach ($configuredList as $origin) {
            $origin = trim((string) $origin);
            if ($origin !== '') {
                $origins[] = $origin;
            }
        }
    }

    $allowedOrigin = trim((string) auth_config('allowed_origin', ''));
    if ($allowedOrigin !== '') {
        $origins[] = $allowedOrigin;
    }

    $siteHomeUrl = auth_config('site_home_url', '');
    if ($siteHomeUrl) {
        $parts = parse_url($siteHomeUrl);
        if (!empty($parts['scheme']) && !empty($parts['host'])) {
            $origins[] = $parts['scheme'] . '://' . $parts['host'];
        }
    }

    return array_values(array_unique(array_filter($origins)));
}

function auth_origin_header(): ?string
{
    $allowedOrigins = auth_allowed_origins();
    $requestOrigin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));

    if ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
        return $requestOrigin;
    }

    return $allowedOrigins[0] ?? null;
}

function auth_is_allowed_redirect(string $url): bool
{
    $url = trim($url);
    if ($url === '') {
        return false;
    }

    if (str_starts_with($url, '/')) {
        return true;
    }

    $parts = parse_url($url);
    if (empty($parts['scheme']) || empty($parts['host'])) {
        return false;
    }

    $origin = $parts['scheme'] . '://' . $parts['host'];
    return in_array($origin, auth_allowed_origins(), true);
}

$origin = auth_origin_header();
if ($origin) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function auth_config(string $key, $default = null)
{
    global $config;
    return $config[$key] ?? $default;
}

function auth_has_minimum_config(): bool
{
    return (bool) (
        auth_config('discord_client_id', '') &&
        auth_config('discord_client_secret', '') &&
        auth_config('discord_redirect_uri', '')
    );
}

function auth_session_cookie_params(): array
{
    global $sessionCookiePath, $sessionCookieDomain, $sessionCookieSecure, $sessionCookieSameSite, $sessionCookieLifetime;

    return [
        'lifetime' => $sessionCookieLifetime,
        'path' => $sessionCookiePath,
        'domain' => $sessionCookieDomain,
        'secure' => $sessionCookieSecure,
        'httponly' => true,
        'samesite' => $sessionCookieSameSite,
    ];
}

function auth_expire_session_cookie(): void
{
    if (!ini_get('session.use_cookies')) {
        return;
    }

    $params = auth_session_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $params['path'],
        'domain' => $params['domain'],
        'secure' => $params['secure'],
        'httponly' => $params['httponly'],
        'samesite' => $params['samesite'],
    ]);
}

function auth_refresh_session_cookie(): void
{
    global $sessionCookieLifetime;

    if ($sessionCookieLifetime <= 0 || !ini_get('session.use_cookies')) {
        return;
    }

    $params = auth_session_cookie_params();
    setcookie(session_name(), session_id(), [
        'expires' => time() + $params['lifetime'],
        'path' => $params['path'],
        'domain' => $params['domain'],
        'secure' => $params['secure'],
        'httponly' => $params['httponly'],
        'samesite' => $params['samesite'],
    ]);
}

function auth_role_ids_from_session(): array
{
    $sources = [
        $_SESSION['discord_roles'] ?? [],
        $_SESSION['discord_staff_roles'] ?? [],
    ];

    $roles = [];
    foreach ($sources as $source) {
        if (is_string($source)) {
            $source = array_map('trim', explode(',', $source));
        }

        if (!is_array($source)) {
            continue;
        }

        foreach ($source as $role) {
            $value = trim((string) $role);
            if ($value !== '') {
                $roles[] = $value;
            }
        }
    }

    return array_values(array_unique($roles));
}

function auth_admin_panel_roles(): array
{
    $configured = auth_config('admin_panel_roles', [
        '1463277998189838427',
        '1463277637911970065',
    ]);

    if (is_string($configured)) {
        $configured = array_map('trim', explode(',', $configured));
    }

    if (!is_array($configured)) {
        return [];
    }

    return array_values(array_unique(array_filter(array_map(
        static fn ($role) => trim((string) $role),
        $configured
    ))));
}

function auth_user_has_admin_panel_access(): bool
{
    if (empty($_SESSION['logged_in'])) {
        return false;
    }

    $requiredRoles = auth_admin_panel_roles();
    if (!$requiredRoles) {
        return false;
    }

    return (bool) array_intersect(auth_role_ids_from_session(), $requiredRoles);
}

function auth_require_admin_panel_access(): void
{
    if (empty($_SESSION['logged_in'])) {
        auth_send_json([
            'ok' => false,
            'error' => 'not_authenticated',
        ], 401);
    }

    if (!auth_user_has_admin_panel_access()) {
        auth_send_json([
            'ok' => false,
            'error' => 'forbidden',
        ], 403);
    }
}

function auth_mysql_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = trim((string) auth_config('mysql_dsn', ''));
    $user = trim((string) auth_config('mysql_user', ''));
    $password = (string) auth_config('mysql_password', '');

    if ($dsn === '' || $user === '') {
        throw new RuntimeException('mysql_not_configured');
    }

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}

function auth_table_exists(PDO $pdo, string $tableName): bool
{
    $stmt = $pdo->prepare('SHOW TABLES LIKE ?');
    $stmt->execute([$tableName]);
    return (bool) $stmt->fetchColumn();
}

function auth_ensure_web_sessions_schema(PDO $pdo): void
{
    static $schemaReady = false;

    if ($schemaReady) {
        return;
    }

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS web_sessions (
            discord_id VARCHAR(32) NOT NULL,
            username VARCHAR(100) NOT NULL,
            avatar VARCHAR(255) NOT NULL DEFAULT '',
            roles LONGTEXT NOT NULL,
            last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (discord_id),
            KEY idx_web_sessions_last_seen (last_seen)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $schemaReady = true;
}

function auth_storage_dir(): string
{
    $configured = trim((string) auth_config('auth_storage_dir', ''));
    $dir = $configured !== '' ? $configured : (__DIR__ . '/data');

    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }

    return $dir;
}

function auth_storage_path(string $filename): string
{
    return rtrim(auth_storage_dir(), '/\\') . DIRECTORY_SEPARATOR . ltrim($filename, '/\\');
}

function auth_storage_read_json(string $filename, array $default = []): array
{
    $path = auth_storage_path($filename);
    if (!is_file($path)) {
        return $default;
    }

    $raw = @file_get_contents($path);
    if ($raw === false || $raw === '') {
        return $default;
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $default;
}

function auth_storage_write_json(string $filename, array $payload): bool
{
    $path = auth_storage_path($filename);
    $encoded = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if (!is_string($encoded)) {
        return false;
    }

    return @file_put_contents($path, $encoded, LOCK_EX) !== false;
}

function auth_record_web_session_fallback(array $record): void
{
    $discordId = trim((string) ($record['discord_id'] ?? ''));
    if ($discordId === '') {
        return;
    }

    $store = auth_storage_read_json('web_sessions.json', ['items' => []]);
    $items = $store['items'] ?? [];
    if (!is_array($items)) {
        $items = [];
    }

    $items[$discordId] = [
        'discord_id' => $discordId,
        'username' => (string) ($record['username'] ?? ''),
        'avatar' => (string) ($record['avatar'] ?? ''),
        'roles' => array_values(array_filter(array_map(
            static fn ($role) => trim((string) $role),
            is_array($record['roles'] ?? null) ? $record['roles'] : []
        ))),
        'last_seen' => (string) ($record['last_seen'] ?? gmdate('Y-m-d H:i:s')),
    ];

    $store['items'] = $items;
    auth_storage_write_json('web_sessions.json', $store);
}

function auth_read_web_sessions_fallback(int $limit = 10): array
{
    $store = auth_storage_read_json('web_sessions.json', ['items' => []]);
    $items = array_values(is_array($store['items'] ?? null) ? $store['items'] : []);

    usort($items, static function (array $left, array $right): int {
        return strcmp((string) ($right['last_seen'] ?? ''), (string) ($left['last_seen'] ?? ''));
    });

    return array_slice($items, 0, max(1, $limit));
}

function auth_send_json(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');

    $origin = auth_origin_header();
    if ($origin) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
    header('Access-Control-Allow-Credentials: true');

    echo json_encode($payload);
    exit;
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    if ($sessionCookieLifetime > 0) {
        ini_set('session.cookie_lifetime', (string) $sessionCookieLifetime);
        $currentGcMaxLifetime = (int) ini_get('session.gc_maxlifetime');
        if ($currentGcMaxLifetime < $sessionCookieLifetime) {
            ini_set('session.gc_maxlifetime', (string) $sessionCookieLifetime);
        }
    }

    session_set_cookie_params(auth_session_cookie_params());
    session_start();
}

if (!empty($_SESSION['logged_in'])) {
    $_SESSION['last_seen_at'] = time();
    auth_refresh_session_cookie();
}

function auth_discord_request(string $url, string $method = 'GET', ?array $data = null, ?string $token = null): array
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);

    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    }

    $headers = ['Content-Type: application/x-www-form-urlencoded'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    curl_close($ch);

    if (!$response) {
        return [];
    }

    $decoded = json_decode($response, true);
    return is_array($decoded) ? $decoded : [];
}
