-- Schema for danielkill.online (production-website)
-- Database Engine: MySQL / MariaDB (Hostinger Premium Web Hosting)

CREATE TABLE IF NOT EXISTS `contact_inquiries` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(180) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('unread', 'read', 'archived') DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_telemetry` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `path` VARCHAR(255) NOT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `ip_hash` CHAR(64) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `visited_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_path` (`path`),
  INDEX `idx_visited_at` (`visited_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
