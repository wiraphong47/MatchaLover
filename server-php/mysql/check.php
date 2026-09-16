<?php
declare(strict_types=1);
// CLI only. No HTTP diagnostic endpoint exposing database configuration.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/connection.php';
try {
    $db = mysqlConnection();
    $db->query('SELECT 1');
    $expected = ['members','addresses','customer_preferences','products','package_items',
        'cart_items','coupons','orders','order_items','payments','points_transactions',
        'newsletter_subscribers','email_jobs','auth_tokens','rate_limits'];
    $tables = $db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    $missing = array_diff($expected, $tables);
    if ($missing) {
        fwrite(STDERR, 'Connected, but missing tables: '.implode(', ', $missing).PHP_EOL);
        exit(2);
    }
    echo 'MySQL connected. All 15 required tables are present.'.PHP_EOL;
    echo 'Products: '.$db->query('SELECT COUNT(*) FROM products')->fetchColumn().PHP_EOL;
} catch (Throwable $error) {
    // No credentials, DSN, customer records or SQL error details are printed.
    fwrite(STDERR, 'Connection check failed. Check config.local.php, database permissions and MySQL service.'.PHP_EOL);
    exit(1);
}
