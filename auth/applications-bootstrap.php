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
        throw new RuntimeException('applications_not_configured');
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

function auth_applications_active_statuses(): array
{
    return ['submitted', 'in_review', 'needs_info', 'interview'];
}

function auth_applications_store_load(): array
{
    return auth_storage_read_json('staff_applications.json', [
        'next_id' => 1,
        'applications' => [],
    ]);
}

function auth_applications_store_save(array $store): bool
{
    return auth_storage_write_json('staff_applications.json', $store);
}

function auth_applications_store_items(array $store): array
{
    return is_array($store['applications'] ?? null) ? array_values($store['applications']) : [];
}

function auth_applications_generate_public_id_from_store(array $store): string
{
    $applications = auth_applications_store_items($store);

    for ($attempt = 0; $attempt < 6; $attempt++) {
        $publicId = 'APP-' . strtoupper(bin2hex(random_bytes(5)));
        $exists = false;
        foreach ($applications as $application) {
            if ((string) ($application['public_id'] ?? '') === $publicId) {
                $exists = true;
                break;
            }
        }

        if (!$exists) {
            return $publicId;
        }
    }

    throw new RuntimeException('public_id_generation_failed');
}

function auth_applications_find_owned_application_in_store(array $store, string $publicId, string $discordId): ?array
{
    foreach (auth_applications_store_items($store) as $application) {
        if ((string) ($application['public_id'] ?? '') === $publicId && (string) ($application['discord_id'] ?? '') === $discordId) {
            return $application;
        }
    }

    return null;
}

function auth_applications_find_active_application_for_user_in_store(array $store, string $discordId): ?array
{
    foreach (auth_applications_store_items($store) as $application) {
        if ((string) ($application['discord_id'] ?? '') !== $discordId) {
            continue;
        }

        if (in_array((string) ($application['status'] ?? 'submitted'), auth_applications_active_statuses(), true)) {
            return $application;
        }
    }

    return null;
}

function auth_applications_list_owned_applications_in_store(array $store, string $discordId): array
{
    $items = array_values(array_filter(auth_applications_store_items($store), static function (array $application) use ($discordId): bool {
        return (string) ($application['discord_id'] ?? '') === $discordId;
    }));

    usort($items, static function (array $left, array $right): int {
        return strcmp((string) ($right['created_at'] ?? ''), (string) ($left['created_at'] ?? ''));
    });

    return $items;
}

function auth_applications_create_file_record(array $user, array $application): array
{
    $store = auth_applications_store_load();
    $applications = auth_applications_store_items($store);
    $nextId = max(1, (int) ($store['next_id'] ?? 1));
    $publicId = auth_applications_generate_public_id_from_store($store);
    $now = gmdate('Y-m-d H:i:s');

    $record = [
        'id' => $nextId,
        'public_id' => $publicId,
        'discord_id' => (string) ($user['discordId'] ?? ''),
        'discord_username' => (string) ($user['discordUsername'] ?? ''),
        'discord_display_name' => (string) ($user['discordDisplayName'] ?? ''),
        'guild_nickname' => (string) ($user['guildNickname'] ?? ''),
        'applicant_name' => (string) ($application['applicant_name'] ?? ''),
        'applicant_level' => $application['applicant_level'],
        'playtime_hours' => $application['playtime_hours'],
        'timezone_label' => (string) ($application['timezone_label'] ?? ''),
        'role_requested' => (string) ($application['role_requested'] ?? ''),
        'availability' => (string) ($application['availability'] ?? ''),
        'ban_history' => (string) ($application['ban_history'] ?? ''),
        'moderation_experience' => (string) ($application['moderation_experience'] ?? ''),
        'testing_experience' => (string) ($application['testing_experience'] ?? ''),
        'fit_reason' => (string) ($application['fit_reason'] ?? ''),
        'status' => 'submitted',
        'assigned_staff_id' => null,
        'assigned_staff_name' => null,
        'last_message_at' => $now,
        'last_staff_reply_at' => null,
        'created_at' => $now,
        'updated_at' => $now,
        'messages' => [[
            'sender_type' => 'system',
            'sender_name' => 'System',
            'message' => 'Application submitted. Staff will review it here and reply in this chat.',
            'created_at' => $now,
        ]],
    ];

    $applications[] = $record;
    $store['next_id'] = $nextId + 1;
    $store['applications'] = $applications;
    if (!auth_applications_store_save($store)) {
        throw new RuntimeException('applications_storage_write_failed');
    }

    return $record;
}

function auth_applications_append_file_message(string $publicId, string $discordId, string $senderName, string $messageText): ?array
{
    $store = auth_applications_store_load();
    $applications = auth_applications_store_items($store);
    $now = gmdate('Y-m-d H:i:s');

    foreach ($applications as $index => $application) {
        if ((string) ($application['public_id'] ?? '') !== $publicId || (string) ($application['discord_id'] ?? '') !== $discordId) {
            continue;
        }

        if ((string) ($application['status'] ?? '') === 'closed') {
            return null;
        }

        $messages = is_array($application['messages'] ?? null) ? $application['messages'] : [];
        $messages[] = [
            'sender_type' => 'applicant',
            'sender_name' => $senderName,
            'message' => $messageText,
            'created_at' => $now,
        ];

        $application['messages'] = $messages;
        $application['status'] = (string) ($application['status'] ?? '') === 'needs_info' ? 'in_review' : (string) ($application['status'] ?? 'submitted');
        $application['last_message_at'] = $now;
        $application['updated_at'] = $now;
        $applications[$index] = $application;
        $store['applications'] = $applications;
        if (!auth_applications_store_save($store)) {
            throw new RuntimeException('applications_storage_write_failed');
        }

        return $application;
    }

    return null;
}

function auth_applications_messages_from_store_record(array $application): array
{
    return array_map('auth_applications_message_payload', is_array($application['messages'] ?? null) ? $application['messages'] : []);
}

function auth_applications_counts_from_store(array $store): array
{
    $counts = [
        'submitted' => 0,
        'in_review' => 0,
        'needs_info' => 0,
        'interview' => 0,
        'accepted' => 0,
        'denied' => 0,
        'closed' => 0,
        'open' => 0,
        'total' => 0,
    ];

    foreach (auth_applications_store_items($store) as $application) {
        $status = strtolower(trim((string) ($application['status'] ?? 'submitted')));
        if (array_key_exists($status, $counts)) {
            $counts[$status]++;
        }
        $counts['total']++;
    }

    $counts['open'] =
        $counts['submitted'] +
        $counts['in_review'] +
        $counts['needs_info'] +
        $counts['interview'];

    return $counts;
}

function auth_applications_recent_from_store(array $store, int $limit = 8): array
{
    $items = auth_applications_store_items($store);
    usort($items, static function (array $left, array $right): int {
        return strcmp((string) ($right['updated_at'] ?? ''), (string) ($left['updated_at'] ?? ''));
    });

    $recent = array_slice($items, 0, max(1, $limit));

    return array_map(static function (array $row): array {
        return [
            'publicId' => (string) ($row['public_id'] ?? ''),
            'applicantName' => (string) ($row['applicant_name'] ?? ''),
            'roleRequested' => (string) ($row['role_requested'] ?? ''),
            'status' => (string) ($row['status'] ?? ''),
            'assignedStaffName' => (string) ($row['assigned_staff_name'] ?? ''),
            'updatedAt' => (string) ($row['updated_at'] ?? ''),
        ];
    }, $recent);
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
