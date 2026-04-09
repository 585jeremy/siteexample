CREATE TABLE IF NOT EXISTS staff_applications (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff_application_messages (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
