<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/mysql/connection.php';

function apiOrigin(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $configured = getenv('API_ALLOWED_ORIGINS');
    if (($configured === false || $configured === '') && is_file(dirname(__DIR__, 2) . '/config.local.php')) {
        $localConfig = require dirname(__DIR__, 2) . '/config.local.php';
        $configured = (string)($localConfig['API_ALLOWED_ORIGINS'] ?? $localConfig['ALLOWED_ORIGINS'] ?? '');
    }
    $allowed = array_filter(array_map('trim', explode(',', $configured ?: 'http://localhost:5173,http://127.0.0.1:5173')));
    $parts = parse_url($origin);
    $host = strtolower((string)($parts['host'] ?? ''));
    $port = (int)($parts['port'] ?? 80);
    $scheme = strtolower((string)($parts['scheme'] ?? ''));
    $privateIp = filter_var($host, FILTER_VALIDATE_IP)
        && !filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    $localDevelopmentOrigin = $scheme === 'http'
        && in_array($port, [80, 5173, 5174, 5500, 5501, 8080], true)
        && (in_array($host, ['localhost','127.0.0.1','::1'], true) || $privateIp);
    if ($origin !== '' && !in_array($origin, $allowed, true) && !$localDevelopmentOrigin) {
        http_response_code(403); exit;
    }
    if ($origin !== '') {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
        header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    }
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

apiOrigin();
ini_set('session.use_strict_mode', '1');
session_name('matcha_mori_session');
session_set_cookie_params([
    'lifetime' => 0, 'path' => '/', 'domain' => '',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true, 'samesite' => 'Lax',
]);
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function apiJson(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function apiBody(): array {
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
        apiJson(415, ['message'=>'ต้องส่งข้อมูลแบบ JSON']);
    }
    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 32768) apiJson(413, ['message'=>'ข้อมูลมีขนาดใหญ่เกินไป']);
    try { $body = json_decode($raw, true, 32, JSON_THROW_ON_ERROR); }
    catch (JsonException) { apiJson(400, ['message'=>'รูปแบบข้อมูลไม่ถูกต้อง']); }
    if (!is_array($body)) apiJson(400, ['message'=>'รูปแบบข้อมูลไม่ถูกต้อง']);
    return $body;
}
function apiCsrf(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function apiRequireCsrf(): void {
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if ($sent === '' || !hash_equals(apiCsrf(), $sent)) apiJson(403, ['message'=>'เซสชันหมดอายุ กรุณาลองใหม่']);
}
function apiUserId(): string {
    $id = $_SESSION['member_id'] ?? '';
    if (!is_string($id) || $id === '') apiJson(401, ['message'=>'กรุณาเข้าสู่ระบบ']);
    return $id;
}
function apiUuid(): string {
    $b = random_bytes(16); $b[6] = chr((ord($b[6]) & 0x0f) | 0x40); $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}
function apiText(mixed $value, int $max): string {
    $text = trim(is_string($value) ? $value : '');
    return mb_substr($text, 0, $max);
}
function apiMember(PDO $db, string $id): array {
    $statement = $db->prepare("SELECT m.id,m.email,m.full_name,m.phone,a.id address_id,a.address,p.interests,p.budget
        FROM members m LEFT JOIN addresses a ON a.member_id=m.id
        LEFT JOIN customer_preferences p ON p.member_id=m.id WHERE m.id=? ORDER BY a.created_at LIMIT 1");
    $statement->execute([$id]); $row = $statement->fetch();
    if (!$row) apiJson(401, ['message'=>'ไม่พบบัญชีสมาชิก']);
    return [
        'memberId'=>$row['id'], 'email'=>$row['email'], 'name'=>$row['full_name'],
        'phone'=>$row['phone'], 'addressId'=>$row['address_id'] ?? $row['id'],
        'address'=>$row['address'] ?? '', 'note'=>$row['interests'] ?? '',
        'budget'=>$row['budget'] === null ? '' : (string)$row['budget'],
    ];
}
set_exception_handler(function (Throwable $error): void {
    error_log('Matcha API failure: ' . get_class($error));
    apiJson(503, ['message'=>'ระบบฐานข้อมูลไม่พร้อม กรุณาลองใหม่']);
});
