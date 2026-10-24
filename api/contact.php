<?php
/**
 * Contact Submission Handler
 * danielkill.online API
 */

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

// Support both JSON body and standard Form POST
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$input = [];

if (stripos($contentType, 'application/json') !== false) {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true) ?: [];
} else {
    $input = $_POST;
}

// 1. Anti-spam Honeypot Check
if (!empty($input['hp_field']) || !empty($input['website_url'])) {
    // Silently succeed for bots
    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent.']);
    exit;
}

// 2. CSRF Verification
$csrfToken = $input['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
if (!verifyCsrfToken($csrfToken)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Security token expired or invalid. Please refresh the page.']);
    exit;
}

// 3. Input Validation
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$subject = trim($input['subject'] ?? 'Portfolio Inquiries');
$message = trim($input['message'] ?? '');

$errors = [];
if (strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Please enter a valid name (2-100 characters).';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}
if (strlen($message) < 5 || strlen($message) > 5000) {
    $errors[] = 'Message must be between 5 and 5,000 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
    exit;
}

$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255);

// 4. Persistence (Database or Fallback File)
$saved = false;

if ($dbConnected && $pdo) {
    try {
        $stmt = $pdo->prepare(
            'INSERT INTO contact_inquiries (name, email, subject, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$name, $email, $subject, $message, $ipAddress, $userAgent]);
        $saved = true;
    } catch (PDOException $e) {
        error_log("Failed to insert contact inquiry into MySQL: " . $e->getMessage());
    }
}

// Fallback to local storage if DB is offline or failed
if (!$saved) {
    $dataDir = __DIR__ . '/../data';
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0700, true);
    }
    
    // Protect data folder with .htaccess
    $htPath = $dataDir . '/.htaccess';
    if (!file_exists($htPath)) {
        @file_put_contents($htPath, "Require all denied\n");
    }

    $inquiryRecord = [
        'timestamp'  => date('c'),
        'name'       => $name,
        'email'      => $email,
        'subject'    => $subject,
        'message'    => $message,
        'ip_address' => $ipAddress,
        'user_agent' => $userAgent,
    ];

    @file_put_contents(
        $dataDir . '/inquiries.jsonl',
        json_encode($inquiryRecord) . "\n",
        FILE_APPEND | LOCK_EX
    );
}

// 5. Email Notification
$recipient = $mailConfig['recipient'] ?? 'daniel@danielkill.online';
$emailSubject = ($mailConfig['subject_prefix'] ?? '[Inquiry] ') . $subject;

$emailBody = "New contact message from danielkill.online:\n\n";
$emailBody .= "Name:    " . $name . "\n";
$emailBody .= "Email:   " . $email . "\n";
$emailBody .= "Subject: " . $subject . "\n";
$emailBody .= "Date:    " . date('Y-m-d H:i:s T') . "\n";
$emailBody .= "IP:      " . $ipAddress . "\n\n";
$emailBody .= "Message:\n" . $message . "\n";

$headers = [
    'From'         => 'noreply@danielkill.online',
    'Reply-To'     => sprintf('"%s" <%s>', addslashes($name), $email),
    'X-Mailer'     => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8',
];

@mail($recipient, $emailSubject, $emailBody, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your message has been received.',
]);
