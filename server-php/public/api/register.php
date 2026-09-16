<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') apiJson(405, ['message'=>'Method not allowed']);
apiRequireCsrf(); $body = apiBody();
$email = strtolower(apiText($body['email'] ?? '', 254));
$password = is_string($body['password'] ?? null) ? $body['password'] : '';
$name = apiText($body['name'] ?? '', 150); $phone = apiText($body['phone'] ?? '', 30);
$address = apiText($body['address'] ?? '', 4000); $note = apiText($body['note'] ?? '', 4000);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $name === '' || $phone === '') apiJson(422, ['message'=>'กรุณากรอกชื่อ อีเมล และเบอร์โทรให้ถูกต้อง']);
if (strlen($password) < 8 || strlen($password) > 200) apiJson(422, ['message'=>'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร']);
if (($body['consent'] ?? false) !== true) apiJson(422, ['message'=>'กรุณายินยอมให้จัดเก็บข้อมูลสมาชิกก่อนสมัคร']);
$db = mysqlConnection(); $id = apiUuid();
try {
    $db->beginTransaction();
    $db->prepare('INSERT INTO members(id,email,password_hash,full_name,phone,consent_at) VALUES (?,?,?,?,?,NOW())')
       ->execute([$id,$email,password_hash($password, PASSWORD_DEFAULT),$name,$phone]);
    $db->prepare('INSERT INTO addresses(id,member_id,recipient_name,phone,address) VALUES (?,?,?,?,?)')
       ->execute([$id,$id,$name,$phone,$address]);
    $db->prepare('INSERT INTO customer_preferences(member_id,interests,menus,tastes,aromas) VALUES (?,?,JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY())')
       ->execute([$id,$note]);
    $db->prepare('INSERT INTO points_transactions(id,member_id,event_key,points,reason) VALUES (?,?,?,?,?)')
       ->execute([apiUuid(),$id,'member-welcome:'.$id,100,'คะแนนต้อนรับสมาชิกใหม่']);
    $db->commit();
} catch (PDOException $error) {
    if ($db->inTransaction()) $db->rollBack();
    if (($error->errorInfo[1] ?? null) === 1062) apiJson(409, ['code'=>'user_already_exists','message'=>'อีเมลนี้สมัครแล้ว กรุณาเข้าสู่ระบบ']);
    throw $error;
}
$emailSent = false;
try {
    require_once dirname(__DIR__, 2) . '/vendor/autoload.php';
    $mailConfig = require dirname(__DIR__, 2) . '/config.local.php';
    $safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $siteUrl = rtrim((string)$mailConfig['SITE_URL'],'/') . '/';
    $content = '<p style="margin:0 0 10px;font-family:Georgia,Tahoma,serif;font-size:27px">Matcha Mori</p><p style="margin:0 0 22px;font-size:12px;letter-spacing:2px">มัทฉะแท้ คุณภาพพรีเมียม</p><h1 style="margin:0 0 12px;font-size:35px;line-height:1.12">ยินดีต้อนรับคุณ<br>' . $safeName . '<br>เข้าสู่ครอบครัวมัทฉะของเรา</h1><p style="margin:0 0 18px;font-size:16px">ขอบคุณที่สมัครสมาชิก<br>บัญชีของคุณพร้อมใช้งานแล้ว</p><table role="presentation" cellspacing="8" cellpadding="0" style="margin-left:-8px"><tr><td style="padding:10px 13px;background:#edf1dc;border-radius:10px"><strong>100 Points</strong><br><span style="font-size:12px">ต้อนรับสมาชิกใหม่</span></td><td style="padding:10px 13px;background:#edf1dc;border-radius:10px"><strong>ลด 12%</strong><br><span style="font-size:12px">โค้ด MATCHA12</span></td></tr></table>';
    $html = '<!doctype html><html lang="th"><meta charset="utf-8"><body style="margin:0;background:#f3eddf;color:#123c29;font-family:Tahoma,Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:12px"><table role="presentation" width="760" height="507" cellspacing="0" cellpadding="0" background="cid:member-welcome-background-v2" style="width:100%;max-width:760px;height:507px;background:#fffdf7 url(cid:member-welcome-background-v2) center/cover no-repeat"><tr><td width="52%" valign="top" style="padding:38px 16px 24px 38px">' . $content . '<p style="margin:22px 0 0"><a href="' . htmlspecialchars($siteUrl,ENT_QUOTES,'UTF-8') . '" style="display:inline-block;padding:13px 22px;border-radius:999px;background:#315d3f;color:#fff;text-decoration:none;font-weight:bold">ไปที่เว็บไซต์ Matcha Mori &nbsp;→</a></p></td><td width="48%">&nbsp;</td></tr></table></td></tr></table></body></html>';
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $mailConfig['SMTP_HOST'];
    $mail->Port = (int)$mailConfig['SMTP_PORT'];
    $mail->SMTPAuth = true;
    $mail->Username = $mailConfig['SMTP_USERNAME'];
    $mail->Password = $mailConfig['SMTP_PASSWORD'];
    $mail->SMTPSecure = $mail->Port === 465 ? 'ssl' : 'tls';
    $mail->Timeout = 30;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($mailConfig['MAIL_FROM'],'Matcha Mori');
    $mail->addAddress($email);
    $mail->Subject = 'ยินดีต้อนรับสู่ Matcha Mori';
    $mail->isHTML(true);
    $mail->Body = $html;
    $mail->AltBody = 'ยินดีต้อนรับคุณ ' . $name . ' เข้าสู่ครอบครัว Matcha Mori บัญชีของคุณพร้อมใช้งานแล้ว ' . $siteUrl;
    $mail->addEmbeddedImage(dirname(__DIR__, 2) . '/assets/member-welcome-background-v2.png','member-welcome-background-v2');
    $mail->send();
    $emailSent = true;
} catch (Throwable $mailError) {
    error_log('Member welcome email failed: ' . get_class($mailError));
}
session_regenerate_id(true); $_SESSION['member_id']=$id; $_SESSION['csrf']=bin2hex(random_bytes(32));
apiJson(201, ['session'=>true,'csrf'=>apiCsrf(),'emailSent'=>$emailSent,'customer'=>apiMember($db,$id)]);
