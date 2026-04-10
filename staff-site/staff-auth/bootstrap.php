<?php

$configPath = __DIR__ . '/config.php';
$staffAuthConfigured = file_exists($configPath);
$staffAuthConfig = $staffAuthConfigured ? require $configPath : [];
if (!is_array($staffAuthConfig)) {
    $staffAuthConfig = [];
    $staffAuthConfigured = false;
}

function staff_auth_config(string $key, $default = null)
{
    global $staffAuthConfig;
    return $staffAuthConfig[$key] ?? $default;
}

function staff_auth_identifier(string $key, string $default): string
{
    $value = trim((string) staff_auth_config($key, $default));
    if ($value === '' || !preg_match('/^[A-Za-z0-9_]+$/', $value)) {
        return $default;
    }

    return $value;
}

function staff_auth_optional_identifier(string $key): ?string
{
    $value = trim((string) staff_auth_config($key, ''));
    if ($value === '' || !preg_match('/^[A-Za-z0-9_]+$/', $value)) {
        return null;
    }

    return $value;
}

function staff_auth_quote_identifier(string $value): string
{
    return '`' . str_replace('`', '', $value) . '`';
}

function staff_auth_allowed_origins(): array
{
    $origins = [];
    $configured = staff_auth_config('allowed_origins', []);

    if (is_string($configured) && trim($configured) !== '') {
        $configured = array_map('trim', explode(',', $configured));
    }

    if (is_array($configured)) {
        foreach ($configured as $origin) {
            $origin = trim((string) $origin);
            if ($origin !== '') {
                $origins[] = $origin;
            }
        }
    }

    $singleOrigin = trim((string) staff_auth_config('allowed_origin', ''));
    if ($singleOrigin !== '') {
        $origins[] = $singleOrigin;
    }

    $fallbackOrigin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
    if ($fallbackOrigin !== '' && preg_match('/^https:\/\/staff\.sgcnr\.net$/i', $fallbackOrigin)) {
        $origins[] = $fallbackOrigin;
    }

    if (!$origins) {
        $origins[] = 'https://staff.sgcnr.net';
    }

    return array_values(array_unique($origins));
}

function staff_auth_origin_header(): ?string
{
    $allowedOrigins = staff_auth_allowed_origins();
    $requestOrigin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));

    if ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
        return $requestOrigin;
    }

    return $allowedOrigins[0] ?? null;
}

$origin = staff_auth_origin_header();
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

$defaultSecure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
$sessionCookiePath = staff_auth_config('session_cookie_path', '/');
$sessionCookieDomain = staff_auth_config('session_cookie_domain', 'staff.sgcnr.net');
$sessionCookieSecure = array_key_exists('session_cookie_secure', $staffAuthConfig)
    ? (bool) $staffAuthConfig['session_cookie_secure']
    : $defaultSecure;
$sessionCookieSameSite = staff_auth_config('session_cookie_samesite', 'Lax');
$defaultSessionCookieLifetime = 60 * 60 * 24 * 30;
$sessionCookieLifetime = (int) staff_auth_config('session_cookie_lifetime', $defaultSessionCookieLifetime);
if ($sessionCookieLifetime < 0) {
    $sessionCookieLifetime = 0;
}

function staff_auth_is_configured(): bool
{
    global $staffAuthConfigured;

    return (bool) (
        $staffAuthConfigured &&
        staff_auth_config('mysql_dsn', '') &&
        staff_auth_config('mysql_user', '')
    );
}

function staff_auth_send_json(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');

    $origin = staff_auth_origin_header();
    if ($origin) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
    header('Access-Control-Allow-Credentials: true');

    echo json_encode($payload);
    exit;
}

function staff_auth_session_cookie_params(): array
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

function staff_auth_expire_session_cookie(): void
{
    if (!ini_get('session.use_cookies')) {
        return;
    }

    $params = staff_auth_session_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $params['path'],
        'domain' => $params['domain'],
        'secure' => $params['secure'],
        'httponly' => $params['httponly'],
        'samesite' => $params['samesite'],
    ]);
}

function staff_auth_input(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST ?: [];
    }

    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        return $decoded;
    }

    parse_str($raw, $parsed);
    return is_array($parsed) ? $parsed : [];
}

function staff_auth_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $pdo = new PDO(
        staff_auth_config('mysql_dsn'),
        staff_auth_config('mysql_user'),
        staff_auth_config('mysql_password', ''),
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    return $pdo;
}

function staff_auth_bool_config(string $key, bool $default = false): bool
{
    $value = staff_auth_config($key, $default);
    if (is_bool($value)) {
        return $value;
    }

    $normalized = strtolower(trim((string) $value));
    if ($normalized === '') {
        return $default;
    }

    return in_array($normalized, ['1', 'true', 'yes', 'on'], true);
}

function staff_auth_has_session(): bool
{
    return !empty($_SESSION['staff_logged_in']) && !empty($_SESSION['staff_account_id']);
}

function staff_auth_access_tokens(): array
{
    $raw = strtolower(trim((string) ($_SESSION['staff_portal_access'] ?? '')));
    if ($raw === '') {
        return [];
    }

    $parts = preg_split('/[\s,|;]+/', $raw) ?: [];
    $tokens = [];

    foreach ($parts as $part) {
        $token = trim((string) $part);
        if ($token !== '') {
            $tokens[$token] = true;
        }
    }

    return array_keys($tokens);
}

function staff_auth_has_access_token(string ...$tokens): bool
{
    $granted = staff_auth_access_tokens();
    if (!$granted) {
        return false;
    }

    foreach ($tokens as $token) {
        $normalized = strtolower(trim($token));
        if ($normalized !== '' && in_array($normalized, $granted, true)) {
            return true;
        }
    }

    return false;
}

function staff_auth_access_level(): string
{
    $clearance = strtolower(trim((string) ($_SESSION['staff_clearance'] ?? '')));

    if (
        staff_auth_has_access_token('all', 'management') ||
        in_array($clearance, ['management', 'manager'], true)
    ) {
        return 'manager';
    }

    if (
        staff_auth_has_access_token('admin', 'operations') ||
        $clearance === 'admin'
    ) {
        return 'admin';
    }

    return 'staff';
}

function staff_auth_application_permissions(): array
{
    $accessLevel = staff_auth_access_level();
    $canManage = in_array($accessLevel, ['manager', 'admin'], true)
        || staff_auth_has_access_token('applications_manage', 'app_manage');
    $canReview = $canManage
        || staff_auth_has_access_token('applications', 'applications_review', 'app_review');

    return [
        'canReview' => $canReview,
        'canManage' => $canManage,
    ];
}

function staff_auth_require_application_review(): void
{
    $permissions = staff_auth_application_permissions();
    if (!$permissions['canReview']) {
        staff_auth_send_json([
            'configured' => staff_auth_is_configured(),
            'ok' => false,
            'error' => 'permission_denied',
            'permissions' => $permissions,
        ], 403);
    }
}

function staff_auth_require_application_manage(): void
{
    $permissions = staff_auth_application_permissions();
    if (!$permissions['canManage']) {
        staff_auth_send_json([
            'configured' => staff_auth_is_configured(),
            'ok' => false,
            'error' => 'permission_denied',
            'permissions' => $permissions,
        ], 403);
    }
}

function staff_auth_session_payload(): array
{
    if (!staff_auth_has_session()) {
        return [
            'configured' => staff_auth_is_configured(),
            'authenticated' => false,
            'passwordResetRequired' => false,
            'user' => null,
        ];
    }

    return [
        'configured' => staff_auth_is_configured(),
        'authenticated' => true,
        'passwordResetRequired' => !empty($_SESSION['staff_password_reset_required']),
        'user' => [
            'staffId' => $_SESSION['staff_id'] ?? '',
            'displayName' => $_SESSION['staff_display_name'] ?? ($_SESSION['staff_id'] ?? ''),
            'clearance' => $_SESSION['staff_clearance'] ?? 'General Staff',
            'issuedBy' => $_SESSION['staff_issued_by'] ?? 'Management Team',
            'portalAccess' => $_SESSION['staff_portal_access'] ?? '',
            'applicationPermissions' => staff_auth_application_permissions(),
            'active' => true,
        ],
    ];
}

function staff_auth_store_account(array $account): void
{
    $_SESSION['staff_logged_in'] = true;
    $_SESSION['staff_account_id'] = $account['id'];
    $_SESSION['staff_id'] = $account['staff_id'];
    $_SESSION['staff_display_name'] = $account['display_name'];
    $_SESSION['staff_clearance'] = $account['clearance'];
    $_SESSION['staff_issued_by'] = $account['issued_by'];
    $_SESSION['staff_portal_access'] = $account['portal_access'] ?? '';
    $_SESSION['staff_password_reset_required'] = !empty($account['password_reset_required']);
}

function staff_auth_require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        staff_auth_send_json([
            'configured' => staff_auth_is_configured(),
            'ok' => false,
            'error' => 'method_not_allowed',
        ], 405);
    }
}

function staff_auth_require_login(): void
{
    if (!staff_auth_has_session()) {
        staff_auth_send_json([
            'configured' => staff_auth_is_configured(),
            'ok' => false,
            'error' => 'not_authenticated',
        ], 401);
    }
}

function staff_auth_txadmin_base_url(): string
{
    return rtrim(trim((string) staff_auth_config('txadmin_base_url', '')), '/');
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name('sgcnr_staff_gate');

    if ($sessionCookieLifetime > 0) {
        $currentGcMaxLifetime = (int) ini_get('session.gc_maxlifetime');
        if ($currentGcMaxLifetime < $sessionCookieLifetime) {
            ini_set('session.gc_maxlifetime', (string) $sessionCookieLifetime);
        }
    }

    session_set_cookie_params(staff_auth_session_cookie_params());
    session_start();
}
