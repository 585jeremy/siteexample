<?php

require_once __DIR__ . '/applications-bootstrap.php';

staff_auth_require_login();
staff_auth_require_application_review();
$publicId = staff_applications_clean_text($_GET['applicationId'] ?? $_GET['id'] ?? '', 24);

if ($publicId === '') {
    staff_auth_send_json([
        'ok' => false,
        'error' => 'missing_application',
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

    $stmt = $pdo->prepare(
        'SELECT sender_type, sender_name, message, created_at
         FROM staff_application_messages
         WHERE application_id = ?
         ORDER BY created_at ASC, id ASC'
    );
    $stmt->execute([(int) $application['id']]);

    staff_auth_send_json([
        'ok' => true,
        'application' => staff_applications_application_payload($application),
        'messages' => array_map('staff_applications_message_payload', $stmt->fetchAll()),
    ]);
} catch (Throwable $e) {
    staff_auth_send_json([
        'ok' => false,
        'error' => 'applications_query_failed',
    ], 500);
}
