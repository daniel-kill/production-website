<?php
/**
 * Configuration Template for danielkill.online
 * Copy this file to config.local.php to configure your MySQL database credentials.
 */

return [
    'db' => [
        'host'     => 'localhost',
        'database' => 'u922787661_portfolio',
        'username' => 'u922787661_user',
        'password' => 'YOUR_STRONG_PASSWORD_HERE',
        'charset'  => 'utf8mb4',
    ],
    'mail' => [
        'recipient' => 'daniel@danielkill.online',
        'subject_prefix' => '[danielkill.online Inquiry] ',
    ],
];
