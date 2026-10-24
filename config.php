<?php
/**
 * Core Configuration & Database Bootstrap for danielkill.online
 * Maintainer: Daniel Kill <daniel@danielkill.online>
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Load local overrides if present
$localConfig = [];
if (file_exists(__DIR__ . '/config.local.php')) {
    $localConfig = require __DIR__ . '/config.local.php';
}

$dbConfig = $localConfig['db'] ?? [
    'host'     => getenv('DB_HOST') ?: 'localhost',
    'database' => getenv('DB_NAME') ?: '',
    'username' => getenv('DB_USER') ?: '',
    'password' => getenv('DB_PASS') ?: '',
    'charset'  => 'utf8mb4',
];

$mailConfig = $localConfig['mail'] ?? [
    'recipient' => 'daniel@danielkill.online',
    'subject_prefix' => '[danielkill.online Inquiry] ',
];

// Database Connection
$pdo = null;
$dbConnected = false;

if (!empty($dbConfig['database']) && !empty($dbConfig['username'])) {
    try {
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            $dbConfig['host'],
            $dbConfig['database'],
            $dbConfig['charset']
        );
        $pdo = new PDO($dsn, $dbConfig['username'], $dbConfig['password'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        $dbConnected = true;
    } catch (PDOException $e) {
        error_log("Database connection warning: " . $e->getMessage());
        $pdo = null;
        $dbConnected = false;
    }
}

// CSRF Token Management
function getCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken(?string $token): bool {
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// Telemetry Logging
function recordTelemetry(string $path = '/'): void {
    global $pdo, $dbConnected;
    if (!$dbConnected || !$pdo) {
        return;
    }

    try {
        $rawIp = $_SERVER['REMOTE_ADDR'] ?? '';
        $ipHash = !empty($rawIp) ? hash('sha256', $rawIp . 'salt_telemetry') : null;
        $referrer = isset($_SERVER['HTTP_REFERER']) ? substr($_SERVER['HTTP_REFERER'], 0, 500) : null;
        $userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 255) : null;

        $stmt = $pdo->prepare('INSERT INTO site_telemetry (path, referrer, ip_hash, user_agent) VALUES (?, ?, ?, ?)');
        $stmt->execute([$path, $referrer, $ipHash, $userAgent]);
    } catch (Throwable $e) {
        error_log("Telemetry logging failed: " . $e->getMessage());
    }
}
