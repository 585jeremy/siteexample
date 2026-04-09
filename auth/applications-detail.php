<?php

require_once __DIR__ . '/applications-bootstrap.php';

$user = auth_applications_require_auth();
$publicId = auth_applications_clean_text($_GET['applicationId'] ?? $_GET['id'] ?? '', 24);

if ($publicId === '') {
    auth_send_json([
        'ok' => false,
        'error' => 'missing_application',
    ], 422);
}

try {
    $pdo = auth_applications_pdo();
    $application = auth_applications_find_owned_application($pdo, $publicId, $user['discordId']);

    if (!$application) {
        auth_send_json([
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

    auth_send_json([
        'ok' => true,
        'application' => auth_applications_application_payload($application),
        'messages' => array_map('auth_applications_message_payload', $stmt->fetchAll()),
    ]);
} catch (Throwable $e) {
    auth_send_json([
        'ok' => false,
        'error' => 'applications_query_failed',
    ], 500);
}
