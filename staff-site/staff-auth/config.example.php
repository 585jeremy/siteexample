<?php

return [
    'mysql_dsn' => 'mysql:host=localhost;dbname=your_staff_db;charset=utf8mb4',
    'mysql_user' => 'your_staff_db_user',
    'mysql_password' => 'your_staff_db_password',
    'staff_table' => 'staff_accounts',
    'staff_record_id_column' => 'staff_id',
    'staff_username_column' => 'username',
    'staff_password_hash_column' => 'password_hash',
    'staff_password_reset_column' => 'is_temp_password',
    'staff_last_login_column' => 'last_login',
    'staff_display_name_column' => '',
    'staff_clearance_column' => '',
    'staff_issued_by_column' => '',
    'staff_portal_access_column' => '',
    'staff_active_column' => '',
    'staff_audit_table' => '',
    'staff_audit_account_id_column' => '',
    'allowed_origin' => 'https://staff.sgcnr.net',
    'allowed_origins' => [
        'https://staff.sgcnr.net',
    ],
    'session_cookie_path' => '/',
    'session_cookie_domain' => 'staff.sgcnr.net',
    'session_cookie_secure' => true,
    'session_cookie_samesite' => 'Lax',
];
