<?php
declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';
session_start(['cookie_httponly'=>true,'cookie_samesite'=>'Lax','cookie_secure'=>(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')]);
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
header('Content-Type: text/html; charset=utf-8'); header('Cache-Control: no-store');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");
?>
<!doctype html>
<html lang="th"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>รับข่าวสาร · Matcha Mori</title>
<style>body{margin:0;padding:30px 18px;background:#eee9dd;color:#183b2a;font:16px/1.8 sans-serif}main{max-width:520px;margin:auto;background:#fffdf9;padding:32px;border-top:6px solid #183b2a}h1{font-family:Georgia,serif}label{display:block;margin:16px 0 5px}input:not([type=checkbox]),select,button{box-sizing:border-box;width:100%;padding:14px;border:1px solid #cfc5b2;border-radius:5px;font:inherit}button{background:#183b2a;color:white;margin-top:20px;cursor:pointer}.muted{color:#65745b}.trap{display:none}</style></head>
<body><main><h1>Matcha Mori</h1><p class="muted">มัทฉะแท้ คุณภาพพรีเมียม</p><h2>จดหมายถึงคนรักมัทฉะ</h2><p>เลือกเมนูโปรด แล้วรับเคล็ดลับและคำแนะนำมัทฉะที่เหมาะกับคุณ</p>
<form action="sendMail.php" method="post">
<input type="hidden" name="csrf" value="<?= escape($_SESSION['csrf']) ?>">
<label for="name">ชื่อที่อยากให้เราเรียก</label><input id="name" name="name" maxlength="100" autocomplete="given-name">
<label for="email">อีเมล</label><input id="email" name="email" type="email" required maxlength="254" autocomplete="email">
<label for="menu">เมนูที่สนใจ</label><select id="menu" name="menu"><option value="latte">มัทฉะลาเต้</option><option value="pure">ชงดื่มเพียว ๆ</option><option value="baking">ทำขนม</option></select>
<div class="trap" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>
<label><input type="checkbox" name="consent" value="yes" required> ยินยอมให้เก็บชื่อ อีเมล และความสนใจเพื่อส่งข่าวสารและคำแนะนำสินค้า ยกเลิกได้จากลิงก์ในอีเมล</label>
<button type="submit">สมัครรับข่าวสาร →</button><p class="muted">หลังส่งคำขอ กรุณากดยืนยันในอีเมลก่อนเริ่มรับข่าวสาร</p>
</form></main></body></html>
