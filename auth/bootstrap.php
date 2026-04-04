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

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $sessionCookiePath,
        'domain' => $sessionCookieDomain,
        'secure' => $sessionCookieSecure,
        'httponly' => true,
        'samesite' => $sessionCookieSameSite,
    ]);
    session_start();
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
