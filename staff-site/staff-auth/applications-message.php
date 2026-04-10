<?php

require_once __DIR__ . '/applications-bootstrap.php';

staff_auth_require_post();
staff_auth_require_login();
staff_auth_require_application_review();
$input = staff_auth_input();

$publicId = staff_applications_clean_text($input['applicationId'] ?? $input['id'] ?? '', 24);
$messageText = staff_applications_clean_text($input['message'] ?? '', 4000);

if ($publicId === '' || $messageText === '') {
    staff_auth_send_json([
        'ok' => false,
        'error' => 'missing_fields',
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

    if (($application['status'] ?? '') === 'closed') {
        staff_auth_send_json([
            'ok' => false,
            'error' => 'application_closed',
        ], 409);
    }

    $staff = staff_applications_current_staff();
    $nextStatus = in_array((string) ($application['status'] ?? ''), ['submitted', 'needs_info'], true)
        ? 'in_review'
        : (string) ($application['status'] ?? 'in_review');

    $pdo->beginTransaction();

    $insert = $pdo->prepare(
        'INSERT INTO staff_application_messages (application_id, sender_type, sender_name, message, created_at)
         VALUES (?, ?, ?, ?, NOW())'
    );
    $insert->execute([
        (int) $application['id'],
        'staff',
        $staff['displayName'] !== '' ? $staff['displayName'] : 'Staff',
        $messageText,
    ]);

    $update = $pdo->prepare(
        'UPDATE staff_applications
         SET status = ?, assigned_staff_id = ?, assigned_staff_name = ?, last_staff_reply_at = NOW(), last_message_at = NOW(), updated_at = NOW()
         WHERE id = ?'
    );
    $update->execute([
        $nextStatus,
        $staff['staffId'] !== '' ? $staff['staffId'] : null,
        $staff['displayName'] !== '' ? $staff['displayName'] : null,
        (int) $application['id'],
    ]);

    $pdo->commit();

    staff_auth_send_json([
        'ok' => true,
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    staff_auth_send_json([
        'ok' => false,
        'error' => 'application_message_failed',
    ], 500);
}
