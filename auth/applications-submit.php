<?php

require_once __DIR__ . '/applications-bootstrap.php';

auth_applications_require_post();
$user = auth_applications_require_auth();
$input = auth_applications_input();

$application = [
    'applicant_name' => auth_applications_clean_text($input['inGameName'] ?? '', 120),
    'applicant_level' => auth_applications_int_or_null($input['inGameLevel'] ?? null),
    'playtime_hours' => auth_applications_int_or_null($input['playtimeHours'] ?? null),
    'timezone_label' => auth_applications_clean_text($input['timezone'] ?? '', 80),
    'role_requested' => auth_applications_clean_text($input['roleRequested'] ?? '', 120),
    'availability' => auth_applications_clean_text($input['availability'] ?? '', 4000),
    'ban_history' => auth_applications_clean_text($input['banHistory'] ?? '', 4000),
    'moderation_experience' => auth_applications_clean_text($input['moderationExperience'] ?? '', 4000),
    'testing_experience' => auth_applications_clean_text($input['testingExperience'] ?? '', 4000),
    'fit_reason' => auth_applications_clean_text($input['fitReason'] ?? '', 5000),
];

$requiredFields = [
    $application['applicant_name'],
    $application['role_requested'],
    $application['availability'],
    $application['ban_history'],
    $application['fit_reason'],
];

foreach ($requiredFields as $value) {
    if ($value === '') {
        auth_send_json([
            'ok' => false,
            'error' => 'missing_fields',
        ], 422);
    }
}

try {
    $pdo = auth_applications_pdo();
    $check = $pdo->prepare(
        "SELECT public_id FROM staff_applications
         WHERE discord_id = ? AND status IN ('submitted', 'in_review', 'needs_info', 'interview')
         LIMIT 1"
    );
    $check->execute([$user['discordId']]);
    $existing = $check->fetch();

    if ($existing) {
        auth_send_json([
            'ok' => false,
            'error' => 'active_application_exists',
            'application' => auth_applications_application_payload($existing),
        ], 409);
    }

    $pdo->beginTransaction();

    $publicId = auth_applications_generate_public_id($pdo);
    $insert = $pdo->prepare(
        'INSERT INTO staff_applications (
            public_id,
            discord_id,
            discord_username,
            discord_display_name,
            guild_nickname,
            applicant_name,
            applicant_level,
            playtime_hours,
            timezone_label,
            role_requested,
            availability,
            ban_history,
            moderation_experience,
            testing_experience,
            fit_reason,
            status,
            last_message_at,
            created_at,
            updated_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW()
        )'
    );
    $insert->execute([
        $publicId,
        $user['discordId'],
        $user['discordUsername'],
        $user['discordDisplayName'],
        $user['guildNickname'],
        $application['applicant_name'],
        $application['applicant_level'],
        $application['playtime_hours'],
        $application['timezone_label'],
        $application['role_requested'],
        $application['availability'],
        $application['ban_history'],
        $application['moderation_experience'],
        $application['testing_experience'],
        $application['fit_reason'],
        'submitted',
    ]);

    $applicationId = (int) $pdo->lastInsertId();
    $message = $pdo->prepare(
        'INSERT INTO staff_application_messages (application_id, sender_type, sender_name, message, created_at)
         VALUES (?, ?, ?, ?, NOW())'
    );
    $message->execute([
        $applicationId,
        'system',
        'System',
        'Application submitted. Staff will review it here and reply in this chat.',
    ]);

    $pdo->commit();

    $row = auth_applications_find_owned_application($pdo, $publicId, $user['discordId']);
    auth_applications_send_webhook('application_submitted', $row ?: []);

    auth_send_json([
        'ok' => true,
        'application' => $row ? auth_applications_application_payload($row) : ['publicId' => $publicId],
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    auth_send_json([
        'ok' => false,
        'error' => 'application_submit_failed',
    ], 500);
}
