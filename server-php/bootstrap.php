<?php
declare(strict_types=1);

require __DIR__ . '/mysql/connection.php';

function config(string $key): string {
    $value = getenv($key);
    if (($value === false || $value === '') && is_file(__DIR__ . '/config.local.php')) {
        static $local;
        $local ??= require __DIR__ . '/config.local.php';
        $value = $local[$key] ?? false;
    }
    if ($value === false || $value === '') throw new RuntimeException("Missing server configuration: $key");
    return $value;
}
function db(): PDO {
    static $pdo;
    if (!$pdo) $pdo = mysqlConnection();
    return $pdo;
}
function query(string $sql, array $values = []): PDOStatement {
    $statement = db()->prepare($sql); $statement->execute($values); return $statement;
}
function jsonResponse(int $status, array $body): never {
    if (defined('FORM_SUBMISSION') && FORM_SUBMISSION) {
        http_response_code($status); header('Content-Type: text/html; charset=utf-8');
        $message = $status === 202 ? 'รับคำขอแล้ว กรุณาตรวจอีเมลเพื่อยืนยันรับข่าวสาร' : ($status === 429 ? 'ส่งคำขอบ่อยเกินไป กรุณาลองใหม่ภายหลัง' : 'ส่งคำขอไม่สำเร็จ กรุณาตรวจข้อมูลหรือลองใหม่');
        echo '<!doctype html><html lang="th"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Matcha Mori</title><body style="font-family:sans-serif;background:#f3eddf;color:#183b2a;padding:30px"><h1>Matcha Mori</h1><p>' . escape($message) . '</p><a href="subscribe_form.php">กลับไปที่ฟอร์ม</a></body></html>'; exit;
    }
    http_response_code($status); header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE); exit;
}
function escape(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function secret(): string {
    $key = getenv('APP_KEY');
    if (($key === false || $key === '') && is_file(__DIR__ . '/config.local.php')) {
        $local = require __DIR__ . '/config.local.php'; $key = $local['APP_KEY'] ?? '';
    }
    // Local fallback remains stable and secret because the DB password is local and gitignored.
    if ($key === '') {
        $database = require __DIR__ . '/mysql/config.local.php';
        $key = hash('sha256', 'matcha-newsletter:' . $database['password']);
    }
    if (strlen($key) < 32 || str_contains($key, 'GENERATE')) throw new RuntimeException('APP_KEY must be random');
    return $key;
}
function unsubscribeToken(string $id): string { return hash_hmac('sha256', 'unsubscribe:' . $id, secret()); }
function apiUuid(): string {
    $b=random_bytes(16); $b[6]=chr((ord($b[6])&0x0f)|0x40); $b[8]=chr((ord($b[8])&0x3f)|0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s',str_split(bin2hex($b),4));
}
function enqueue(string $dedupe, string $kind, string $email, ?string $id, array $payload): void {
    query('INSERT IGNORE INTO email_jobs(dedupe_key,kind,recipient,subscriber_id,payload) VALUES (?,?,?,?,?)',
        [$dedupe,$kind,$email,$id,json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE)]);
}
function rateLimit(string $key, int $limit, int $seconds): void {
    $bucket = hash_hmac('sha256', $key . ':' . intdiv(time(), $seconds), secret());
    query('INSERT INTO rate_limits(bucket,attempts,expires_at) VALUES (?,1,DATE_ADD(NOW(),INTERVAL ? SECOND)) ON DUPLICATE KEY UPDATE attempts=attempts+1',[$bucket,$seconds]);
    $count = (int)query('SELECT attempts FROM rate_limits WHERE bucket=?',[$bucket])->fetchColumn();
    if ($count > $limit) jsonResponse(429, ['message'=>'Too many requests']);
}
set_exception_handler(function (Throwable $error): void {
    error_log('Matcha mail request failed: ' . get_class($error));
    if (PHP_SAPI === 'cli') { fwrite(STDERR, "Mail operation failed; check configuration/database/SMTP.\n"); exit(1); }
    jsonResponse(503, ['message'=>'Service temporarily unavailable']);
});
