<?php

require_once __DIR__ . '/applications-bootstrap.php';

staff_auth_require_login();
staff_auth_require_application_review();

try {
    $pdo = staff_applications_pdo();
    $stmt = $pdo->query(
        "SELECT public_id, applicant_name, role_requested, status, assigned_staff_name, created_at, updated_at, last_message_at, last_staff_reply_at
         FROM staff_applications
         ORDER BY FIELD(status, 'submitted', 'in_review', 'needs_info', 'interview', 'accepted', 'denied', 'closed'), last_message_at DESC, created_at DESC"
    );
    $items = array_map('staff_applications_application_payload', $stmt->fetchAll());

    $counts = [
        'submitted' => 0,
        'in_review' => 0,
        'needs_info' => 0,
        'interview' => 0,
        'accepted' => 0,
        'denied' => 0,
        'closed' => 0,
    ];

    foreach ($items as $item) {
        $status = $item['status'] ?? 'submitted';
        if (isset($counts[$status])) {
            $counts[$status]++;
        }
    }

    staff_auth_send_json([
        'ok' => true,
        'items' => $items,
        'counts' => $counts,
        'permissions' => staff_auth_application_permissions(),
    ]);
} catch (Throwable $e) {
    staff_auth_send_json([
        'ok' => false,
        'error' => 'applications_query_failed',
    ], 500);
}
