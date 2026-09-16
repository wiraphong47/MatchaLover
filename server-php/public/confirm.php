<?php
declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store'); header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");
$action = $_POST['action'] ?? $_GET['action'] ?? 'confirm';
$id = $_POST['id'] ?? $_GET['id'] ?? '';
$token = $_POST['token'] ?? $_GET['token'] ?? '';
if (!is_string($token) || !preg_match('/^[a-f0-9]{64}$/D',$token) || !is_string($id) || !preg_match('/^[a-f0-9-]{36}$/D',$id) || !in_array($action,['confirm','unsubscribe'],true)) { http_response_code(400); exit('ลิงก์ไม่ถูกต้อง'); }
$label = $action === 'unsubscribe' ? 'ยกเลิกรับข่าวสาร' : 'ยืนยันรับข่าวสาร';
$message = '';
// GET only displays a form: email link scanners cannot subscribe/unsubscribe anyone.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    db()->beginTransaction();
    $row = query('SELECT * FROM newsletter_subscribers WHERE id=? FOR UPDATE',[$id])->fetch();
    if ($action === 'unsubscribe' && hash_equals(unsubscribeToken($id),$token)) {
        query("UPDATE newsletter_subscribers SET status='unsubscribed',unsubscribed_at=NOW(),confirmation_hash=NULL WHERE id=?",[$id]);
        query('UPDATE email_jobs SET cancelled_at=NOW() WHERE subscriber_id=? AND sent_at IS NULL',[$id]);
        $message = 'ยกเลิกรับข่าวสารแล้ว';
    } elseif ($row && $action === 'confirm' && $row['status'] === 'pending' && strtotime($row['confirmation_expires_at'] ?? '') > time() && hash_equals($row['confirmation_hash'] ?? '',hash('sha256',$token))) {
        query("UPDATE newsletter_subscribers SET status='subscribed',confirmed_at=NOW(),unsubscribed_at=NULL,confirmation_hash=NULL WHERE id=?",[$id]);
        enqueue('newsletter:' . $id . ':' . hash('sha256',$token),'newsletter',$row['email'],$id,[]);
        $message = 'ขอบคุณที่สมัครรับข่าวสาร เราจะส่งคำแนะนำมัทฉะตามเมนูที่คุณเลือก';
    } else { http_response_code(400); $message = 'ลิงก์หมดอายุหรือใช้งานแล้ว กรุณาสมัครรับข่าวสารใหม่หากยังไม่ได้ยืนยัน'; }
    db()->commit();
}
echo '<!doctype html><html lang="th"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Matcha Mori</title><body style="background:#f3eddf;color:#183b2a;font-family:sans-serif;padding:30px"><main style="max-width:560px;margin:auto;background:#fffdf9;padding:30px"><h1>Matcha Mori</h1>';
if ($message) echo '<p>' . escape($message) . '</p><a href="' . escape(config('SITE_URL')) . '">กลับไปที่ร้าน</a>';
else echo '<h2>' . escape($label) . '</h2><form method="post"><input type="hidden" name="id" value="' . escape($id) . '"><input type="hidden" name="token" value="' . escape($token) . '"><input type="hidden" name="action" value="' . escape($action) . '"><button style="padding:14px;background:#183b2a;color:white">' . escape($label) . '</button></form>';
echo '</main></body></html>';
