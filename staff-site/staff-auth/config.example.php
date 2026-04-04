<?php

return [
    'mysql_dsn' => 'mysql:host=localhost;dbname=your_staff_db;charset=utf8mb4',
    'mysql_user' => 'your_staff_db_user',
    'mysql_password' => 'your_staff_db_password',
    'allowed_origin' => 'https://staff.sgcnr.net',
    'allowed_origins' => [
        'https://staff.sgcnr.net',
    ],
    'session_cookie_path' => '/',
    'session_cookie_domain' => 'staff.sgcnr.net',
    'session_cookie_secure' => true,
    'session_cookie_samesite' => 'Lax',
];
