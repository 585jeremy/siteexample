<?php

require_once __DIR__ . '/bootstrap.php';

function staff_applications_ensure_schema(PDO $pdo): void
{
    static $schemaReady = false;

    if ($schemaReady) {
        return;
    }

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS staff_applications (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            public_id VARCHAR(24) NOT NULL,
            discord_id VARCHAR(32) NOT NULL,
            discord_username VARCHAR(100) NOT NULL,
            discord_display_name VARCHAR(120) NOT NULL,
            guild_nickname VARCHAR(120) NOT NULL DEFAULT '',
            applicant_name VARCHAR(120) NOT NULL,
            applicant_level INT UNSIGNED DEFAULT NULL,
            playtime_hours INT UNSIGNED DEFAULT NULL,
            timezone_label VARCHAR(80) NOT NULL DEFAULT '',
            role_requested VARCHAR(120) NOT NULL,
            availability TEXT NOT NULL,
            ban_history TEXT NOT NULL,
            moderation_experience TEXT NOT NULL,
            testing_experience TEXT NOT NULL,
            fit_reason TEXT NOT NULL,
            status VARCHAR(24) NOT NULL DEFAULT 'submitted',
            assigned_staff_id VARCHAR(64) DEFAULT NULL,
            assigned_staff_name VARCHAR(120) DEFAULT NULL,
            last_message_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            last_staff_reply_at DATETIME DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY uq_staff_applications_public_id (public_id),
            KEY idx_staff_applications_discord_id (discord_id),
            KEY idx_staff_applications_status (status),
            KEY idx_staff_applications_last_message_at (last_message_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS staff_application_messages (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            application_id BIGINT UNSIGNED NOT NULL,
            sender_type VARCHAR(24) NOT NULL,
            sender_name VARCHAR(120) NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_staff_application_messages_application_id (application_id),
            KEY idx_staff_application_messages_created_at (created_at),
            CONSTRAINT fk_staff_application_messages_application
                FOREIGN KEY (application_id) REFERENCES staff_applications (id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $schemaReady = true;
}

function staff_applications_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = trim((string) staff_auth_config('applications_mysql_dsn', staff_auth_config('mysql_dsn', '')));
    $user = trim((string) staff_auth_config('applications_mysql_user', staff_auth_config('mysql_user', '')));
    $password = (string) staff_auth_config('applications_mysql_password', staff_auth_config('mysql_password', ''));

    if ($dsn === '' || $user === '') {
        staff_auth_send_json([
            'ok' => false,
            'error' => 'applications_not_configured',
        ], 500);
    }

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    staff_applications_ensure_schema($pdo);

    return $pdo;
}

function staff_applications_clean_text($value, int $maxLength = 0): string
{
    $text = trim((string) $value);
    if ($maxLength > 0 && strlen($text) > $maxLength) {
        $text = substr($text, 0, $maxLength);
    }

    return $text;
}

function staff_applications_current_staff(): array
{
    return [
        'staffId' => (string) ($_SESSION['staff_id'] ?? ''),
        'displayName' => (string) ($_SESSION['staff_display_name'] ?? ($_SESSION['staff_id'] ?? 'Staff')),
    ];
}

function staff_applications_allowed_statuses(): array
{
    return ['submitted', 'in_review', 'needs_info', 'interview', 'accepted', 'denied', 'closed'];
}

function staff_applications_application_payload(array $row): array
{
    return [
        'publicId' => (string) ($row['public_id'] ?? ''),
        'discordUsername' => (string) ($row['discord_username'] ?? ''),
        'discordDisplayName' => (string) ($row['discord_display_name'] ?? ''),
        'applicantName' => (string) ($row['applicant_name'] ?? ''),
        'inGameName' => (string) ($row['applicant_name'] ?? ''),
        'inGameLevel' => isset($row['applicant_level']) ? (int) $row['applicant_level'] : null,
        'playtimeHours' => isset($row['playtime_hours']) ? (int) $row['playtime_hours'] : null,
        'timezone' => (string) ($row['timezone_label'] ?? ''),
        'roleRequested' => (string) ($row['role_requested'] ?? ''),
        'availability' => (string) ($row['availability'] ?? ''),
        'banHistory' => (string) ($row['ban_history'] ?? ''),
        'moderationExperience' => (string) ($row['moderation_experience'] ?? ''),
        'testingExperience' => (string) ($row['testing_experience'] ?? ''),
        'fitReason' => (string) ($row['fit_reason'] ?? ''),
        'status' => (string) ($row['status'] ?? 'submitted'),
        'assignedStaffId' => (string) ($row['assigned_staff_id'] ?? ''),
        'assignedStaffName' => (string) ($row['assigned_staff_name'] ?? ''),
        'createdAt' => (string) ($row['created_at'] ?? ''),
        'updatedAt' => (string) ($row['updated_at'] ?? ''),
        'lastMessageAt' => (string) ($row['last_message_at'] ?? ''),
        'lastStaffReplyAt' => (string) ($row['last_staff_reply_at'] ?? ''),
    ];
}

function staff_applications_message_payload(array $row): array
{
    return [
        'senderType' => (string) ($row['sender_type'] ?? 'system'),
        'senderName' => (string) ($row['sender_name'] ?? 'System'),
        'message' => (string) ($row['message'] ?? ''),
        'createdAt' => (string) ($row['created_at'] ?? ''),
    ];
}

function staff_applications_find_by_public_id(PDO $pdo, string $publicId): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM staff_applications WHERE public_id = ? LIMIT 1');
    $stmt->execute([$publicId]);
    $row = $stmt->fetch();
    return is_array($row) ? $row : null;
}
