CREATE TABLE IF NOT EXISTS `game_player_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `license_primary` VARCHAR(96) NOT NULL,
  `citizen_id` VARCHAR(64) DEFAULT NULL,
  `discord_id` VARCHAR(32) DEFAULT NULL,
  `steam_id` VARCHAR(64) DEFAULT NULL,
  `rockstar_id` VARCHAR(64) DEFAULT NULL,
  `character_name` VARCHAR(120) DEFAULT NULL,
  `display_name` VARCHAR(120) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `profile_visibility` ENUM('public','login','staff','private') NOT NULL DEFAULT 'public',
  `is_online` TINYINT(1) NOT NULL DEFAULT 0,
  `first_seen_at` DATETIME DEFAULT NULL,
  `last_seen_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_game_profiles_license` (`license_primary`),
  KEY `idx_game_profiles_discord` (`discord_id`),
  KEY `idx_game_profiles_citizen` (`citizen_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game_player_stats` (
  `player_id` BIGINT UNSIGNED NOT NULL,
  `cash_money` BIGINT NOT NULL DEFAULT 0,
  `bank_money` BIGINT NOT NULL DEFAULT 0,
  `playtime_minutes` INT NOT NULL DEFAULT 0,
  `kills` INT NOT NULL DEFAULT 0,
  `deaths` INT NOT NULL DEFAULT 0,
  `kd_ratio` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `arrests` INT NOT NULL DEFAULT 0,
  `bank_heists` INT NOT NULL DEFAULT 0,
  `missions_completed` INT NOT NULL DEFAULT 0,
  `warnings` INT NOT NULL DEFAULT 0,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`player_id`),
  CONSTRAINT `fk_game_stats_player` FOREIGN KEY (`player_id`) REFERENCES `game_player_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game_live_status` (
  `id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `server_status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `online_players` INT DEFAULT NULL,
  `max_players` INT DEFAULT NULL,
  `active_missions` INT DEFAULT NULL,
  `active_robberies` INT DEFAULT NULL,
  `active_heists` INT DEFAULT NULL,
  `queue_count` INT DEFAULT NULL,
  `uptime_seconds` INT DEFAULT NULL,
  `restart_label` VARCHAR(120) DEFAULT NULL,
  `next_restart_at` DATETIME DEFAULT NULL,
  `payload_json` LONGTEXT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game_event_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_type` VARCHAR(64) NOT NULL,
  `severity` VARCHAR(24) NOT NULL DEFAULT 'info',
  `player_license` VARCHAR(96) DEFAULT NULL,
  `player_discord_id` VARCHAR(32) DEFAULT NULL,
  `actor_license` VARCHAR(96) DEFAULT NULL,
  `actor_discord_id` VARCHAR(32) DEFAULT NULL,
  `title` VARCHAR(180) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `payload_json` LONGTEXT DEFAULT NULL,
  `event_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_game_event_type` (`event_type`),
  KEY `idx_game_event_player_license` (`player_license`),
  KEY `idx_game_event_at` (`event_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game_leaderboard_cache` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `board_key` VARCHAR(64) NOT NULL,
  `board_label` VARCHAR(120) NOT NULL,
  `row_order` INT NOT NULL DEFAULT 0,
  `player_license` VARCHAR(96) DEFAULT NULL,
  `player_name` VARCHAR(120) DEFAULT NULL,
  `stat_value` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `meta_json` LONGTEXT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_game_leaderboard_board` (`board_key`),
  KEY `idx_game_leaderboard_order` (`board_key`, `row_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game_sync_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `source` VARCHAR(80) NOT NULL,
  `sync_type` VARCHAR(64) NOT NULL,
  `status` VARCHAR(24) NOT NULL DEFAULT 'accepted',
  `received_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `details_json` LONGTEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_game_sync_source` (`source`),
  KEY `idx_game_sync_type` (`sync_type`),
  KEY `idx_game_sync_received` (`received_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
