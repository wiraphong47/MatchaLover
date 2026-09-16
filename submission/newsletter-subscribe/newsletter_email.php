<?php
declare(strict_types=1);
$value = filter_input(INPUT_GET, 'email', FILTER_VALIDATE_EMAIL);
$email = htmlspecialchars(is_string($value) ? $value : 'customer@example.com', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$websiteUrl = '#';
?>
<!doctype html>
<html lang="th">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ขอบคุณที่สมัครรับข่าวสาร</title></head>
<body style="margin:0;background:#f3eddf;color:#123c29;font-family:Tahoma,Arial,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:12px">
  <table role="presentation" width="760" height="507" cellspacing="0" cellpadding="0" background="newsletter-hero-v2.png" style="width:100%;max-width:760px;height:507px;background:#fffdf7 url('newsletter-hero-v2.png') center/cover no-repeat">
    <tr>
      <td width="52%" valign="top" style="padding:38px 16px 24px 38px">
        <p style="margin:0 0 10px;font-family:Georgia,Tahoma,serif;font-size:27px">Matcha Mori</p>
        <p style="margin:0 0 22px;font-size:12px;letter-spacing:2px">มัทฉะแท้ คุณภาพพรีเมียม</p>
        <h1 style="margin:0 0 18px;font-size:39px;line-height:1.12">ขอบคุณที่<br>สมัครรับข่าวสาร</h1>
        <p style="margin:0 0 8px;font-size:17px"><strong>อีเมล <?= $email ?></strong></p>
        <p style="margin:0 0 20px;font-size:15px">ถูกเพิ่มในรายชื่อรับข่าวสารเรียบร้อยแล้ว</p>
        <p style="margin:0;font-size:15px">อัปเดตมัทฉะใหม่ สูตรชงง่าย ๆ<br>และโปรโมชั่นจากร้าน</p>
        <p style="margin:22px 0 0"><a href="<?= htmlspecialchars($websiteUrl, ENT_QUOTES, 'UTF-8') ?>" style="display:inline-block;padding:13px 22px;border-radius:999px;background:#315d3f;color:#fff;text-decoration:none;font-weight:bold">ค้นพบมัทฉะของคุณ &nbsp;→</a></p>
      </td>
      <td width="48%">&nbsp;</td>
    </tr>
  </table>
</td></tr></table>
</body>
</html>
