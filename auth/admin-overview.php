<?php

require __DIR__ . '/bootstrap.php';

auth_require_admin_panel_access();

function auth_admin_connect_applications_pdo(): ?PDO
{
    static $pdo = false;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = trim((string) auth_config('applications_mysql_dsn', auth_config('mysql_dsn', '')));
    $user = trim((string) auth_config('applications_mysql_user', auth_config('mysql_user', '')));
    $password = (string) auth_config('applications_mysql_password', auth_config('mysql_password', ''));

    if ($dsn === '' || $user === '') {
        return null;
    }

    try {
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (Throwable $e) {
        return null;
    }

    return $pdo;
}

try {
    $payload = [
        'ok' => true,
        'recentLogins' => [
            'available' => false,
            'items' => [],
        ],
        'applications' => [
            'available' => false,
            'counts' => [
                'submitted' => 0,
                'in_review' => 0,
                'needs_info' => 0,
                'interview' => 0,
                'accepted' => 0,
                'denied' => 0,
                'closed' => 0,
                'open' => 0,
                'total' => 0,
            ],
            'recent' => [],
        ],
    ];

    try {
        $pdo = auth_mysql_pdo();
        auth_ensure_web_sessions_schema($pdo);

        if (auth_table_exists($pdo, 'web_sessions')) {
            $stmt = $pdo->query(
                "SELECT discord_id, username, avatar, roles, last_seen
                 FROM web_sessions
                 ORDER BY last_seen DESC
                 LIMIT 10"
            );

            $payload['recentLogins']['available'] = true;
            $payload['recentLogins']['items'] = array_map(static function (array $row): array {
                $roles = json_decode((string) ($row['roles'] ?? '[]'), true);
                $roleCount = is_array($roles) ? count($roles) : 0;

                return [
                    'discordId' => (string) ($row['discord_id'] ?? ''),
                    'username' => (string) ($row['username'] ?? ''),
                    'avatar' => (string) ($row['avatar'] ?? ''),
                    'lastSeen' => (string) ($row['last_seen'] ?? ''),
                    'roleCount' => $roleCount,
                ];
            }, $stmt->fetchAll() ?: []);
        }
    } catch (Throwable $e) {
        $payload['recentLogins']['available'] = false;
    }

    $applicationsPdo = auth_admin_connect_applications_pdo();
    if ($applicationsPdo instanceof PDO && auth_table_exists($applicationsPdo, 'staff_applications')) {
        $payload['applications']['available'] = true;

        $countRows = $applicationsPdo->query(
            "SELECT status, COUNT(*) AS total
             FROM staff_applications
             GROUP BY status"
        )->fetchAll() ?: [];

        foreach ($countRows as $row) {
            $status = strtolower(trim((string) ($row['status'] ?? '')));
            $count = (int) ($row['total'] ?? 0);
            if ($status !== '' && array_key_exists($status, $payload['applications']['counts'])) {
                $payload['applications']['counts'][$status] = $count;
            }
            $payload['applications']['counts']['total'] += $count;
        }

        $payload['applications']['counts']['open'] =
            $payload['applications']['counts']['submitted'] +
            $payload['applications']['counts']['in_review'] +
            $payload['applications']['counts']['needs_info'] +
            $payload['applications']['counts']['interview'];

        $recentStmt = $applicationsPdo->query(
            "SELECT public_id, applicant_name, role_requested, status, assigned_staff_name, updated_at
             FROM staff_applications
             ORDER BY updated_at DESC
             LIMIT 8"
        );

        $payload['applications']['recent'] = array_map(static function (array $row): array {
            return [
                'publicId' => (string) ($row['public_id'] ?? ''),
                'applicantName' => (string) ($row['applicant_name'] ?? ''),
                'roleRequested' => (string) ($row['role_requested'] ?? ''),
                'status' => (string) ($row['status'] ?? ''),
                'assignedStaffName' => (string) ($row['assigned_staff_name'] ?? ''),
                'updatedAt' => (string) ($row['updated_at'] ?? ''),
            ];
        }, $recentStmt->fetchAll() ?: []);
    }

    auth_send_json($payload);
} catch (Throwable $e) {
    auth_send_json([
        'ok' => false,
        'error' => 'admin_overview_failed',
    ], 500);
}
