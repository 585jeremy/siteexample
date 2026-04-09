<?php

require_once __DIR__ . '/applications-bootstrap.php';

staff_auth_require_post();
staff_auth_require_login();
$input = staff_auth_input();

$publicId = staff_applications_clean_text($input['applicationId'] ?? $input['id'] ?? '', 24);
$status = strtolower(staff_applications_clean_text($input['status'] ?? '', 24));
$assignToSelf = !empty($input['assignToSelf']);

if ($publicId === '' || $status === '') {
    staff_auth_send_json([
        'ok' => false,
        'error' => 'missing_fields',
    ], 422);
}

if (!in_array($status, staff_applications_allowed_statuses(), true)) {
    staff_auth_send_json([
        'ok' => false,
        'error' => 'invalid_status',
    ], 422);
}

try {
    $pdo = staff_applications_pdo();
    $application = staff_applications_find_by_public_id($pdo, $publicId);

    if (!$application) {
        staff_auth_send_json([
            'ok' => false,
            'error' => 'application_not_found',
        ], 404);
    }

    $statusChanged = $status !== (string) ($application['status'] ?? '');
    $staff = staff_applications_current_staff();
    $shouldAssign = $assignToSelf || $statusChanged;
    $assignedStaffId = $shouldAssign ? $staff['staffId'] : (string) ($application['assigned_staff_id'] ?? '');
    $assignedStaffName = $shouldAssign ? $staff['displayName'] : (string) ($application['assigned_staff_name'] ?? '');

    $pdo->beginTransaction();

    $update = $pdo->prepare(
        'UPDATE staff_applications
         SET status = ?, assigned_staff_id = ?, assigned_staff_name = ?, updated_at = NOW()
         WHERE id = ?'
    );
    $update->execute([
        $status,
        $assignedStaffId !== '' ? $assignedStaffId : null,
        $assignedStaffName !== '' ? $assignedStaffName : null,
        (int) $application['id'],
    ]);

    if ($statusChanged) {
        $message = $pdo->prepare(
            'INSERT INTO staff_application_messages (application_id, sender_type, sender_name, message, created_at)
             VALUES (?, ?, ?, ?, NOW())'
        );
        $message->execute([
            (int) $application['id'],
            'system',
            $staff['displayName'] !== '' ? $staff['displayName'] : 'Staff',
            sprintf('Status updated to %s.', str_replace('_', ' ', $status)),
        ]);

        $touch = $pdo->prepare('UPDATE staff_applications SET last_message_at = NOW() WHERE id = ?');
        $touch->execute([(int) $application['id']]);
    }

    $pdo->commit();

    $application = staff_applications_find_by_public_id($pdo, $publicId);
    staff_auth_send_json([
        'ok' => true,
        'application' => $application ? staff_applications_application_payload($application) : ['publicId' => $publicId],
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    staff_auth_send_json([
        'ok' => false,
        'error' => 'application_update_failed',
    ], 500);
}
