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

if (empty($_SESSION['staff_logged_in']) || empty($_SESSION['staff_account_id'])) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'not_authenticated',
    ], 401);
}

$input = staff_auth_input();
$newPassword = (string) ($input['newPassword'] ?? '');
$confirmPassword = (string) ($input['confirmPassword'] ?? '');

if ($newPassword === '' || $confirmPassword === '') {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'missing_password_fields',
    ], 422);
}

if ($newPassword !== $confirmPassword) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'password_mismatch',
    ], 422);
}

if (strlen($newPassword) < 8) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'password_too_short',
    ], 422);
}

try {
    $pdo = staff_auth_pdo();
    $stmt = $pdo->prepare(
        'UPDATE staff_accounts
         SET password_hash = ?, password_reset_required = 0, updated_at = NOW()
         WHERE id = ?'
    );
    $stmt->execute([
        password_hash($newPassword, PASSWORD_DEFAULT),
        $_SESSION['staff_account_id'],
    ]);
} catch (Throwable $exception) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'password_update_failed',
    ], 500);
}

$_SESSION['staff_password_reset_required'] = false;

try {
    $audit = $pdo->prepare(
        'INSERT INTO staff_audit_log (staff_account_id, action, target, meta_json)
         VALUES (?, ?, ?, ?)'
    );
    $audit->execute([
        $_SESSION['staff_account_id'],
        'password_reset_completed',
        $_SESSION['staff_id'] ?? '',
        json_encode(['via' => 'staff_portal']),
    ]);
} catch (Throwable $exception) {
    // Non-fatal.
}

$payload = staff_auth_session_payload();
$payload['mode'] = 'database';
$payload['ok'] = true;
staff_auth_send_json($payload);
