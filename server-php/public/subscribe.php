<?php
declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';
header('Cache-Control: no-store');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!defined('FORM_SUBMISSION')) {
$allowedOrigins = array_map('trim', explode(',', config('ALLOWED_ORIGINS')));
$originParts = parse_url($origin);
$originHost = strtolower((string)($originParts['host'] ?? ''));
$originPort = (int)($originParts['port'] ?? 80);
$localFileOrigin = $origin === 'null';
$projectPagesOrigin = $origin === 'https://wiraphong47.github.io';
$privateIp = filter_var($originHost, FILTER_VALIDATE_IP)
    && !filter_var($originHost, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
$localDevelopmentOrigin = in_array($originPort, [80, 5173, 5174, 5500, 5501, 8080], true)
    && (in_array($originHost, ['localhost','127.0.0.1','::1'], true) || $privateIp);
// Same-origin requests routed through the local Vite proxy can arrive without
// an Origin header. This is a public, rate-limited signup endpoint, so only
// validate CORS when the browser actually supplied an origin.
if (
    $origin !== ''
    && !$localFileOrigin
    && !$projectPagesOrigin
    && !in_array($origin, $allowedOrigins, true)
    && !$localDevelopmentOrigin
) jsonResponse(403, ['message'=>'Origin not allowed']);
if ($origin !== '') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(405, ['message'=>'POST required']);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 4096) jsonResponse(413, ['message'=>'Payload too large']);
if (defined('FORM_SUBMISSION')) {
    session_start(['cookie_httponly'=>true,'cookie_samesite'=>'Lax','cookie_secure'=>(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')]);
    if (empty($_SESSION['csrf']) || !is_string($_POST['csrf'] ?? null) || !hash_equals($_SESSION['csrf'],$_POST['csrf'])) jsonResponse(403,['message'=>'Invalid CSRF']);
    $data = $_POST;
    $data['consent'] = ($data['consent'] ?? '') === 'yes';
    session_write_close();
} else {
    $raw = file_get_contents('php://input', false, null, 0, 4097);
    if (strlen($raw) > 4096) jsonResponse(413, ['message'=>'Payload too large']);
    $data = json_decode($raw, true);
}
if (!is_array($data)) jsonResponse(400, ['message'=>'Invalid JSON']);
foreach (['email','name','menu','website'] as $field) if (isset($data[$field]) && !is_string($data[$field])) jsonResponse(400, ['message'=>'Invalid fields']);
$email = strtolower(trim($data['email'] ?? ''));
$name = trim($data['name'] ?? ''); $menu = $data['menu'] ?? '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || strlen($name) > 400 || !in_array($menu,['pure','latte','baking'],true) || ($data['consent'] ?? false) !== true) jsonResponse(400, ['message'=>'Invalid signup or missing consent']);
if (!empty($data['website'])) jsonResponse(202, ['message'=>'Request received']);
$existing = query('SELECT id,status FROM newsletter_subscribers WHERE email=? LIMIT 1',[$email])->fetch();
// Do not trust forwarded IP headers unless your proxy is explicitly configured.
if ($existing && $existing['status'] === 'subscribed') {
    // Existing readers can request a fresh copy without consuming the new
    // signup IP bucket, while rapid repeated clicks are still contained.
    rateLimit('newsletter-resend:' . $email, 3, 60);
} else {
    rateLimit('ip:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 20, 3600);
    rateLimit('email:' . $email, 1, 3600);
}
rateLimit('global', 200, 86400);
db()->beginTransaction();
$row = query('SELECT id,status FROM newsletter_subscribers WHERE email=? FOR UPDATE',[$email])->fetch();
if (!$row) {
    $id = apiUuid();
    query("INSERT INTO newsletter_subscribers(id,email,full_name,interests,status,consent_at,confirmed_at) VALUES (?,?,?,JSON_ARRAY(?),'subscribed',NOW(),NOW())",[$id,$email,$name,$menu]);
    $row = ['id'=>$id,'status'=>'subscribed'];
} else {
    query("UPDATE newsletter_subscribers SET full_name=?,interests=JSON_ARRAY(?),status='subscribed',consent_at=NOW(),confirmed_at=NOW(),confirmation_hash=NULL,confirmation_expires_at=NULL,unsubscribed_at=NULL WHERE id=?",[$name,$menu,$row['id']]);
}
db()->commit();

// Send this newsletter in the same request so the browser only reports
// success after Gmail accepts the message. Membership mail still uses jobs.
require_once dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/emailContent.php';
$person = query("SELECT *,JSON_UNQUOTE(JSON_EXTRACT(interests,'$[0]')) AS menu FROM newsletter_subscribers WHERE id=?",[$row['id']])->fetch();
[$subject,$html,$plain] = emailTemplate('newsletter',$person,[]);
$mail = new PHPMailer\PHPMailer\PHPMailer(true);
$mail->isSMTP();
$mail->Host = config('SMTP_HOST');
$mail->Port = (int)config('SMTP_PORT');
$mail->SMTPAuth = true;
$mail->Username = config('SMTP_USERNAME');
$mail->Password = config('SMTP_PASSWORD');
$mail->SMTPSecure = $mail->Port === 465 ? 'ssl' : 'tls';
$mail->Timeout = 30;
$mail->CharSet = 'UTF-8';
$mail->setFrom(config('MAIL_FROM'),'Matcha Mori');
$mail->addAddress($email);
$mail->Subject = $subject;
$mail->isHTML(true);
$mail->Body = $html;
$mail->AltBody = $plain;
$mail->addEmbeddedImage(dirname(__DIR__) . '/assets/newsletter-hero-v2.png','newsletter-hero-v2');
$mail->send();
jsonResponse(200, ['message'=>'Email sent']);
