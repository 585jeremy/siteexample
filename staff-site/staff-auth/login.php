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
    $table = staff_auth_quote_identifier(staff_auth_identifier('staff_table', 'staff_accounts'));
    $recordIdColumn = staff_auth_quote_identifier(staff_auth_identifier('staff_record_id_column', 'staff_id'));
    $usernameColumn = staff_auth_quote_identifier(staff_auth_identifier('staff_username_column', 'username'));
    $passwordHashColumn = staff_auth_quote_identifier(staff_auth_identifier('staff_password_hash_column', 'password_hash'));
    $resetColumn = staff_auth_quote_identifier(staff_auth_identifier('staff_password_reset_column', 'is_temp_password'));
    $displayNameColumn = staff_auth_optional_identifier('staff_display_name_column');
    $clearanceColumn = staff_auth_optional_identifier('staff_clearance_column');
    $issuedByColumn = staff_auth_optional_identifier('staff_issued_by_column');
    $portalAccessColumn = staff_auth_optional_identifier('staff_portal_access_column');
    $activeColumn = staff_auth_optional_identifier('staff_active_column');

    $selectParts = [
        $recordIdColumn . ' AS record_id',
        $usernameColumn . ' AS staff_login',
        $passwordHashColumn . ' AS password_hash',
        $resetColumn . ' AS password_reset_required',
        ($displayNameColumn ? staff_auth_quote_identifier($displayNameColumn) : $usernameColumn) . ' AS display_name',
        ($clearanceColumn ? staff_auth_quote_identifier($clearanceColumn) : "'General Staff'") . ' AS clearance',
        ($issuedByColumn ? staff_auth_quote_identifier($issuedByColumn) : "'Management Team'") . ' AS issued_by',
        ($portalAccessColumn ? staff_auth_quote_identifier($portalAccessColumn) : "''") . ' AS portal_access',
        ($activeColumn ? staff_auth_quote_identifier($activeColumn) : '1') . ' AS active',
    ];

    $stmt = $pdo->prepare(
        'SELECT ' . implode(', ', $selectParts) . '
         FROM ' . $table . '
         WHERE ' . $usernameColumn . ' = ?
         LIMIT 1'
    );
    $stmt->execute([$staffId]);
    $record = $stmt->fetch();
} catch (Throwable $exception) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'db_query_failed',
    ], 500);
}

if (!$record || empty($record['active'])) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'invalid_credentials',
    ], 401);
}

if (!password_verify($password, (string) $record['password_hash'])) {
    staff_auth_send_json([
        'configured' => true,
        'ok' => false,
        'error' => 'invalid_credentials',
    ], 401);
}

$account = [
    'id' => $record['record_id'],
    'staff_id' => $record['staff_login'],
    'display_name' => $record['display_name'] ?: $record['staff_login'],
    'clearance' => $record['clearance'] ?: 'General Staff',
    'issued_by' => $record['issued_by'] ?: 'Management Team',
    'portal_access' => $record['portal_access'] ?? '',
    'password_reset_required' => !empty($record['password_reset_required']),
];

staff_auth_store_account($account);

try {
    $lastLoginColumn = staff_auth_optional_identifier('staff_last_login_column');
    if ($lastLoginColumn) {
        $update = $pdo->prepare(
            'UPDATE ' . $table . ' SET ' . staff_auth_quote_identifier($lastLoginColumn) . ' = NOW() WHERE ' . $recordIdColumn . ' = ?'
        );
        $update->execute([$account['id']]);
    }
} catch (Throwable $exception) {
    // Non-fatal.
}

$payload = staff_auth_session_payload();
$payload['mode'] = 'database';
$payload['ok'] = true;
staff_auth_send_json($payload);
