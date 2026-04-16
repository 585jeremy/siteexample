<?php

require_once __DIR__ . '/applications-bootstrap.php';

$user = auth_applications_require_auth();

try {
    $pdo = auth_applications_pdo();
    $stmt = $pdo->prepare(
        'SELECT public_id, applicant_name, role_requested, status, assigned_staff_name, created_at, updated_at, last_message_at, last_staff_reply_at
         FROM staff_applications
         WHERE discord_id = ?
         ORDER BY created_at DESC'
    );
    $stmt->execute([$user['discordId']]);

    $items = array_map('auth_applications_application_payload', $stmt->fetchAll());

    auth_send_json([
        'ok' => true,
        'items' => $items,
    ]);
} catch (Throwable $e) {
    try {
        $store = auth_applications_store_load();
        $items = array_map('auth_applications_application_payload', auth_applications_list_owned_applications_in_store($store, $user['discordId']));
        auth_send_json([
            'ok' => true,
            'items' => $items,
        ]);
    } catch (Throwable $fallbackError) {
        auth_send_json([
            'ok' => false,
            'error' => 'applications_query_failed',
        ], 500);
    }
}
