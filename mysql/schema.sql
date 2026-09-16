-- Matcha Mori: MySQL 8.0.16+ schema.
-- Creates missing tables only. Never drops or replaces existing customer data.
CREATE DATABASE IF NOT EXISTS matcha_mori CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE matcha_mori;

CREATE TABLE IF NOT EXISTS members (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email_verified_at DATETIME NULL,
  consent_at DATETIME NOT NULL,
  consent_version VARCHAR(40) NOT NULL DEFAULT 'member-v1',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS addresses (
  id CHAR(36) PRIMARY KEY,
  member_id CHAR(36) NOT NULL,
  recipient_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address TEXT NOT NULL,
  postal_code VARCHAR(20) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_preferences (
  member_id CHAR(36) PRIMARY KEY,
  interests TEXT NOT NULL,
  menus JSON NULL,
  tastes JSON NULL,
  aromas JSON NULL,
  budget DECIMAL(12,2) NULL CHECK (budget IS NULL OR budget >= 0),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category ENUM('matcha','package','tools') NOT NULL,
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  size VARCHAR(40) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  image_path VARCHAR(255) NOT NULL DEFAULT '',
  details JSON NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Keep package-only accessories as labelled line items, not invented shop products.
CREATE TABLE IF NOT EXISTS package_items (
  package_id VARCHAR(80) NOT NULL,
  position INT NOT NULL,
  product_id VARCHAR(80) NULL,
  name VARCHAR(200) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  matcha_replaceable BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (package_id, position),
  FOREIGN KEY (package_id) REFERENCES products(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart_items (
  id CHAR(36) PRIMARY KEY,
  member_id CHAR(36) NOT NULL,
  product_id VARCHAR(80) NOT NULL,
  selected_matcha_id VARCHAR(80) NULL,
  quantity INT NOT NULL CHECK (quantity BETWEEN 1 AND 99),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (selected_matcha_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupons (
  code VARCHAR(40) PRIMARY KEY,
  discount_percent DECIMAL(5,2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at DATETIME NULL
) ENGINE=InnoDB;
INSERT INTO coupons(code, discount_percent) VALUES ('MATCHA12',12)
ON DUPLICATE KEY UPDATE code = coupons.code;

CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) PRIMARY KEY,
  member_id CHAR(36) NOT NULL,
  idempotency_key VARCHAR(80) NOT NULL,
  status ENUM('pending_payment','pending_review','paid','shipped','cancelled') NOT NULL DEFAULT 'pending_payment',
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(254) NOT NULL,
  shipping_address JSON NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  discount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total DECIMAL(12,2) GENERATED ALWAYS AS (subtotal - discount + shipping_fee) STORED,
  coupon_code VARCHAR(40) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (member_id, idempotency_key),
  CONSTRAINT orders_discount_within_subtotal CHECK (discount <= subtotal),
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (coupon_code) REFERENCES coupons(code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  product_id VARCHAR(80) NOT NULL,
  name VARCHAR(200) NOT NULL,
  options JSON NULL,
  unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  line_total DECIMAL(12,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  method ENUM('promptpay','bank_transfer') NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  slip_path VARCHAR(255) NULL,
  status ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS points_transactions (
  id CHAR(36) PRIMARY KEY,
  member_id CHAR(36) NOT NULL,
  order_id CHAR(36) NULL,
  event_key VARCHAR(150) NOT NULL UNIQUE,
  points INT NOT NULL,
  reason VARCHAR(150) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL DEFAULT '',
  interests JSON NULL,
  status ENUM('pending','subscribed','unsubscribed') NOT NULL DEFAULT 'pending',
  consent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmation_hash CHAR(64) NULL,
  confirmation_expires_at DATETIME NULL,
  confirmed_at DATETIME NULL,
  unsubscribed_at DATETIME NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS email_jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dedupe_key VARCHAR(150) NOT NULL UNIQUE,
  kind ENUM('confirm','newsletter','member') NOT NULL,
  recipient VARCHAR(254) NOT NULL,
  subscriber_id CHAR(36) NULL,
  payload JSON NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  available_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME NULL,
  cancelled_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX jobs_pending(sent_at,cancelled_at,available_at),
  FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auth_tokens (
  token_hash CHAR(64) PRIMARY KEY,
  member_id CHAR(36) NOT NULL,
  purpose ENUM('verify_email','reset_password') NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  FOREIGN KEY (member_id) REFERENCES members(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket CHAR(64) PRIMARY KEY,
  attempts INT NOT NULL DEFAULT 1,
  expires_at DATETIME NOT NULL,
  INDEX rate_expiry(expires_at)
) ENGINE=InnoDB;

-- Aggregate orders and points separately to avoid multiplying totals when joined.
-- This is for the store administrator in Workbench, not a public API endpoint.
CREATE OR REPLACE SQL SECURITY INVOKER VIEW member_overview AS
SELECT m.id,m.full_name,m.email,m.phone,m.created_at,
       p.interests,p.budget,
       COALESCE(o.order_count,0) AS order_count,
       COALESCE(o.paid_total,0) AS paid_total,
       COALESCE(t.points,0) AS points
FROM members m
LEFT JOIN customer_preferences p ON p.member_id=m.id
LEFT JOIN (
  SELECT member_id,COUNT(*) AS order_count,
    SUM(CASE WHEN status IN ('paid','shipped') THEN total ELSE 0 END) AS paid_total
  FROM orders GROUP BY member_id
) o ON o.member_id=m.id
LEFT JOIN (
  SELECT member_id,SUM(points) AS points FROM points_transactions GROUP BY member_id
) t ON t.member_id=m.id;
