<?php

require_once __DIR__ . '/applications-bootstrap.php';

auth_applications_require_post();
$user = auth_applications_require_auth();
$input = auth_applications_input();

$publicId = auth_applications_clean_text($input['applicationId'] ?? $input['id'] ?? '', 24);
$messageText = auth_applications_clean_text($input['message'] ?? '', 4000);

if ($publicId === '') {
    auth_send_json([
        'ok' => false,
        'error' => 'missing_application',
    ], 422);
}

if ($messageText === '') {
    auth_send_json([
        'ok' => false,
        'error' => 'missing_message',
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

    if (($application['status'] ?? '') === 'closed') {
        auth_send_json([
            'ok' => false,
            'error' => 'application_closed',
        ], 409);
    }

    $pdo->beginTransaction();

    $insert = $pdo->prepare(
        'INSERT INTO staff_application_messages (application_id, sender_type, sender_name, message, created_at)
         VALUES (?, ?, ?, ?, NOW())'
    );
    $insert->execute([
        (int) $application['id'],
        'applicant',
        $user['guildNickname'] !== '' ? $user['guildNickname'] : $user['discordDisplayName'],
        $messageText,
    ]);

    $nextStatus = ($application['status'] ?? '') === 'needs_info' ? 'in_review' : (string) ($application['status'] ?? 'submitted');
    $update = $pdo->prepare(
        'UPDATE staff_applications
         SET status = ?, last_message_at = NOW(), updated_at = NOW()
         WHERE id = ?'
    );
    $update->execute([$nextStatus, (int) $application['id']]);

    $pdo->commit();

    $application = auth_applications_find_owned_application($pdo, $publicId, $user['discordId']);
    auth_applications_send_webhook('applicant_message', $application ?: [], [
        'message' => $messageText,
    ]);

    auth_send_json([
        'ok' => true,
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    try {
        $senderName = $user['guildNickname'] !== '' ? $user['guildNickname'] : $user['discordDisplayName'];
        $application = auth_applications_append_file_message($publicId, $user['discordId'], $senderName, $messageText);

        if (!$application) {
            auth_send_json([
                'ok' => false,
                'error' => 'application_not_found',
            ], 404);
        }

        auth_applications_send_webhook('applicant_message', $application, [
            'message' => $messageText,
        ]);

        auth_send_json([
            'ok' => true,
        ]);
    } catch (Throwable $fallbackError) {
        auth_send_json([
            'ok' => false,
            'error' => 'application_message_failed',
        ], 500);
    }
}
