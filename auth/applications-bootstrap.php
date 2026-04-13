<?php

require_once __DIR__ . '/bootstrap.php';

function auth_applications_table_exists(PDO $pdo, string $table): bool
{
    $stmt = $pdo->prepare('SHOW TABLES LIKE ?');
    $stmt->execute([$table]);
    return (bool) $stmt->fetchColumn();
}

function auth_applications_column_exists(PDO $pdo, string $table, string $column): bool
{
    if (!auth_applications_table_exists($pdo, $table)) {
        return false;
    }

    $stmt = $pdo->prepare(sprintf('SHOW COLUMNS FROM `%s` LIKE ?', $table));
    $stmt->execute([$column]);
    return (bool) $stmt->fetchColumn();
}

function auth_applications_add_column_if_missing(PDO $pdo, string $table, string $column, string $definition): void
{
    if (auth_applications_column_exists($pdo, $table, $column)) {
        return;
    }

    $pdo->exec(sprintf(
        'ALTER TABLE `%s` ADD COLUMN `%s` %s',
        $table,
        $column,
        $definition
    ));
}

function auth_applications_ensure_schema(PDO $pdo): void
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

    $applicationColumns = [
        'public_id' => "VARCHAR(24) NOT NULL DEFAULT '' AFTER `id`",
        'discord_id' => "VARCHAR(32) NOT NULL DEFAULT '' AFTER `public_id`",
        'discord_username' => "VARCHAR(100) NOT NULL DEFAULT '' AFTER `discord_id`",
        'discord_display_name' => "VARCHAR(120) NOT NULL DEFAULT '' AFTER `discord_username`",
        'guild_nickname' => "VARCHAR(120) NOT NULL DEFAULT '' AFTER `discord_display_name`",
        'applicant_name' => "VARCHAR(120) NOT NULL DEFAULT '' AFTER `guild_nickname`",
        'applicant_level' => "INT UNSIGNED DEFAULT NULL AFTER `applicant_name`",
        'playtime_hours' => "INT UNSIGNED DEFAULT NULL AFTER `applicant_level`",
        'timezone_label' => "VARCHAR(80) NOT NULL DEFAULT '' AFTER `playtime_hours`",
        'role_requested' => "VARCHAR(120) NOT NULL DEFAULT '' AFTER `timezone_label`",
        'availability' => "TEXT NOT NULL AFTER `role_requested`",
        'ban_history' => "TEXT NOT NULL AFTER `availability`",
        'moderation_experience' => "TEXT NOT NULL AFTER `ban_history`",
        'testing_experience' => "TEXT NOT NULL AFTER `moderation_experience`",
        'fit_reason' => "TEXT NOT NULL AFTER `testing_experience`",
        'status' => "VARCHAR(24) NOT NULL DEFAULT 'submitted' AFTER `fit_reason`",
        'assigned_staff_id' => "VARCHAR(64) DEFAULT NULL AFTER `status`",
        'assigned_staff_name' => "VARCHAR(120) DEFAULT NULL AFTER `assigned_staff_id`",
        'last_message_at' => "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `assigned_staff_name`",
        'last_staff_reply_at' => "DATETIME DEFAULT NULL AFTER `last_message_at`",
        'created_at' => "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `last_staff_reply_at`",
        'updated_at' => "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`",
    ];

    foreach ($applicationColumns as $column => $definition) {
        auth_applications_add_column_if_missing($pdo, 'staff_applications', $column, $definition);
    }

    $messageColumns = [
        'application_id' => "BIGINT UNSIGNED NOT NULL AFTER `id`",
        'sender_type' => "VARCHAR(24) NOT NULL DEFAULT 'system' AFTER `application_id`",
        'sender_name' => "VARCHAR(120) NOT NULL DEFAULT 'System' AFTER `sender_type`",
        'message' => "TEXT NOT NULL AFTER `sender_name`",
        'created_at' => "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `message`",
    ];

    foreach ($messageColumns as $column => $definition) {
        auth_applications_add_column_if_missing($pdo, 'staff_application_messages', $column, $definition);
    }

    $schemaReady = true;
}

function auth_applications_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = trim((string) auth_config('applications_mysql_dsn', auth_config('mysql_dsn', '')));
    $user = trim((string) auth_config('applications_mysql_user', auth_config('mysql_user', '')));
    $password = (string) auth_config('applications_mysql_password', auth_config('mysql_password', ''));

    if ($dsn === '' || $user === '') {
        auth_send_json([
            'ok' => false,
            'error' => 'applications_not_configured',
        ], 500);
    }

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    auth_applications_ensure_schema($pdo);

    return $pdo;
}

function auth_applications_input(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST ?: [];
    }

    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        return $decoded;
    }

    parse_str($raw, $parsed);
    return is_array($parsed) ? $parsed : [];
}

function auth_applications_require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        auth_send_json([
            'ok' => false,
            'error' => 'method_not_allowed',
        ], 405);
    }
}

function auth_applications_require_auth(): array
{
    if (empty($_SESSION['logged_in']) || empty($_SESSION['discord_id'])) {
        auth_send_json([
            'ok' => false,
            'error' => 'not_authenticated',
        ], 401);
    }

    return [
        'discordId' => (string) ($_SESSION['discord_id'] ?? ''),
        'discordUsername' => (string) ($_SESSION['discord_username'] ?? ''),
        'discordDisplayName' => (string) ($_SESSION['discord_display_name'] ?? ($_SESSION['discord_username'] ?? '')),
        'guildNickname' => (string) ($_SESSION['discord_guild_nick'] ?? ($_SESSION['discord_display_name'] ?? ($_SESSION['discord_username'] ?? ''))),
    ];
}

function auth_applications_clean_text($value, int $maxLength = 0): string
{
    $text = trim((string) $value);
    if ($maxLength > 0 && strlen($text) > $maxLength) {
        $text = substr($text, 0, $maxLength);
    }

    return $text;
}

function auth_applications_int_or_null($value): ?int
{
    if ($value === null || $value === '') {
        return null;
    }

    if (!is_numeric($value)) {
        return null;
    }

    return max(0, (int) $value);
}

function auth_applications_status_label(string $status): string
{
    $labels = [
        'submitted' => 'Submitted',
        'in_review' => 'Under Review',
        'needs_info' => 'Needs Info',
        'interview' => 'Interview',
        'accepted' => 'Accepted',
        'denied' => 'Rejected',
        'closed' => 'Closed',
    ];

    return $labels[$status] ?? 'Open';
}

function auth_applications_application_payload(array $row): array
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
        'assignedStaffName' => (string) ($row['assigned_staff_name'] ?? ''),
        'createdAt' => (string) ($row['created_at'] ?? ''),
        'updatedAt' => (string) ($row['updated_at'] ?? ''),
        'lastMessageAt' => (string) ($row['last_message_at'] ?? ''),
        'lastStaffReplyAt' => (string) ($row['last_staff_reply_at'] ?? ''),
    ];
}

function auth_applications_message_payload(array $row): array
{
    return [
        'senderType' => (string) ($row['sender_type'] ?? 'system'),
        'senderName' => (string) ($row['sender_name'] ?? 'System'),
        'message' => (string) ($row['message'] ?? ''),
        'createdAt' => (string) ($row['created_at'] ?? ''),
    ];
}

function auth_applications_find_owned_application(PDO $pdo, string $publicId, string $discordId): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM staff_applications WHERE public_id = ? AND discord_id = ? LIMIT 1');
    $stmt->execute([$publicId, $discordId]);
    $row = $stmt->fetch();
    return is_array($row) ? $row : null;
}

function auth_applications_generate_public_id(PDO $pdo): string
{
    for ($attempt = 0; $attempt < 6; $attempt++) {
        $publicId = 'APP-' . strtoupper(bin2hex(random_bytes(5)));
        $stmt = $pdo->prepare('SELECT 1 FROM staff_applications WHERE public_id = ? LIMIT 1');
        $stmt->execute([$publicId]);
        if (!$stmt->fetchColumn()) {
            return $publicId;
        }
    }

    throw new RuntimeException('public_id_generation_failed');
}

function auth_applications_send_webhook(string $event, array $application, array $context = []): void
{
    $webhookUrl = trim((string) auth_config('applications_discord_webhook_url', ''));
    if ($webhookUrl === '') {
        return;
    }

    $staffUrl = trim((string) auth_config('applications_staff_portal_url', 'https://staff.sgcnr.net/#/applications'));
    $title = $event === 'application_submitted'
        ? 'New staff application'
        : 'Applicant replied';
    $description = $event === 'application_submitted'
        ? sprintf(
            '%s submitted %s for %s.',
            (string) ($application['discord_display_name'] ?: $application['discord_username']),
            (string) ($application['public_id'] ?? ''),
            (string) ($application['role_requested'] ?? 'staff')
        )
        : sprintf(
            '%s sent a new chat reply on %s.',
            (string) ($application['discord_display_name'] ?: $application['discord_username']),
            (string) ($application['public_id'] ?? '')
        );

    $payload = [
        'content' => $staffUrl !== '' ? $staffUrl : null,
        'embeds' => [[
            'title' => $title,
            'description' => $description,
            'color' => $event === 'application_submitted' ? 13228543 : 10181046,
            'fields' => array_values(array_filter([
                [
                    'name' => 'Case',
                    'value' => (string) ($application['public_id'] ?? ''),
                    'inline' => true,
                ],
                [
                    'name' => 'Role',
                    'value' => (string) ($application['role_requested'] ?? 'Staff'),
                    'inline' => true,
                ],
                !empty($application['assigned_staff_name']) ? [
                    'name' => 'Assigned staff',
                    'value' => (string) $application['assigned_staff_name'],
                    'inline' => true,
                ] : null,
                !empty($context['message']) ? [
                    'name' => 'Latest message',
                    'value' => substr((string) $context['message'], 0, 280),
                    'inline' => false,
                ] : null,
            ])),
        ]],
    ];

    $ch = curl_init($webhookUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    curl_exec($ch);
    curl_close($ch);
}
