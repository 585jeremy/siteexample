<?php
require __DIR__ . '/bootstrap.php';

staff_auth_require_post();

if (!staff_auth_is_configured()) {
    staff_auth_send_json([
        'configured' => false,
        'ok' => false,
        'error' => 'staff_auth_not_configured',
    ], 503);
}

$input = staff_auth_input();
$staffId = trim((string) ($input['staffId'] ?? ''));
$password = (string) ($input['password'] ?? '');

if ($staffId === '' || $password === '') {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'missing_credentials',
    ], 422);
}

try {
    $pdo = staff_auth_pdo();
    $stmt = $pdo->prepare(
        'SELECT id, staff_id, password_hash, display_name, clearance, issued_by, portal_access, password_reset_required, active
         FROM staff_accounts
         WHERE staff_id = ?
         LIMIT 1'
    );
    $stmt->execute([$staffId]);
    $account = $stmt->fetch();
} catch (Throwable $exception) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'db_query_failed',
    ], 500);
}

if (!$account || empty($account['active'])) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'invalid_credentials',
    ], 401);
}

if (!password_verify($password, (string) $account['password_hash'])) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'invalid_credentials',
    ], 401);
}

staff_auth_store_account($account);

try {
    $update = $pdo->prepare('UPDATE staff_accounts SET last_login_at = NOW() WHERE id = ?');
    $update->execute([$account['id']]);
} catch (Throwable $exception) {
    // Non-fatal.
}

$payload = staff_auth_session_payload();
$payload['mode'] = 'database';
$payload['ok'] = true;
staff_auth_send_json($payload);
