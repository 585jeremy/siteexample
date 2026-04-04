CREATE TABLE IF NOT EXISTS staff_accounts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    staff_id VARCHAR(64) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    clearance VARCHAR(80) NOT NULL DEFAULT 'General Staff',
    issued_by VARCHAR(120) NOT NULL DEFAULT 'Management Team',
    portal_access VARCHAR(32) NOT NULL DEFAULT '',
    password_reset_required TINYINT(1) NOT NULL DEFAULT 1,
    active TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at DATETIME NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_staff_accounts_staff_id (staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff_audit_log (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    staff_account_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(120) NOT NULL,
    target VARCHAR(120) NOT NULL DEFAULT '',
    meta_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_staff_audit_log_staff_account_id (staff_account_id),
    CONSTRAINT fk_staff_audit_log_account
        FOREIGN KEY (staff_account_id) REFERENCES staff_accounts(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
