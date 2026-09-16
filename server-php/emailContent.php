<?php
declare(strict_types=1);
function emailTemplate(string $kind, array $person, array $payload): array {
    $site = rtrim(config('SITE_URL'),'/') . '/';
    $name = escape($person['full_name'] ?: 'คนรักมัทฉะ');
    $email = escape((string)($person['email'] ?? ''));
    $footer = '';
    if ($kind === 'confirm') {
        $subject = 'ยืนยันสมัครรับข่าวสารจาก Matcha Mori';
        $body = '<h1 style="margin:0 0 14px;font-size:38px;line-height:1.18;color:#123c29">ขอบคุณที่<br>สมัครรับข่าวสาร</h1><p style="font-size:18px;margin:0 0 8px"><strong>อีเมล ' . $email . '</strong></p><p>เราได้รับคำขอสมัครของคุณแล้ว เหลืออีกเพียงหนึ่งขั้นตอน กรุณากดปุ่มด้านล่างเพื่อยืนยันและรับอัปเดตมัทฉะใหม่ สูตรชงง่าย ๆ และโปรโมชั่นจากร้าน</p><p style="font-size:13px;color:#667267">ลิงก์ใช้ได้ 24 ชั่วโมง หากคุณไม่ได้สมัคร ไม่ต้องดำเนินการใด ๆ</p>';
        $url = rtrim(config('API_URL'),'/') . '/confirm.php?' . http_build_query(['id'=>$person['id'],'token'=>$payload['token']]);
        $cta = 'ยืนยันรับข่าวสาร';
    } elseif ($kind === 'member') {
        $subject = 'ยินดีต้อนรับสู่ Matcha Mori';
        $body = 'ยินดีต้อนรับคุณ ' . $name . ' เข้าสู่ครอบครัว Matcha Mori บัญชีของคุณพร้อมใช้งานแล้ว';
        $url = $site; $cta = 'ไปที่เว็บไซต์ Matcha Mori';
    } else {
        $subject = 'มัทฉะที่คัดมาให้ตามเมนูโปรดของคุณ · Matcha Mori';
        $tips = ['pure'=>'เริ่มจากผงมัทฉะ 2 กรัม ร่อนก่อนตี และใช้น้ำอุ่นไม่เดือด เพื่อสัมผัสกลิ่นและรสของชา', 'latte'=>'ตีมัทฉะกับน้ำอุ่นเล็กน้อยก่อนเติมนม แล้วค่อยปรับความหวานตามชอบ', 'baking'=>'ร่อนมัทฉะรวมกับวัตถุดิบแห้งก่อนผสม เพื่อช่วยลดการจับตัวเป็นก้อน'];
        $menu = $person['menu'];
        $body = 'ขอบคุณที่สมัครรับข่าวสาร อีเมล ' . $email . ' ถูกเพิ่มในรายชื่อรับข่าวสารเรียบร้อยแล้ว';
        $url = $site . '#products'; $cta = 'เลือกมัทฉะแก้วแรกสำหรับคุณ';
        $unsubscribe = rtrim(config('API_URL'),'/') . '/confirm.php?' . http_build_query(['action'=>'unsubscribe','id'=>$person['id'],'token'=>unsubscribeToken($person['id'])]);
        $footer = '<p><a href="' . escape($unsubscribe) . '">ยกเลิกรับข่าวสาร</a></p>';
    }
    if (in_array($kind, ['member','newsletter'], true)) {
        $cid = $kind === 'member' ? 'member-welcome-background-v2' : 'newsletter-hero-v2';
        if ($kind === 'member') {
            $content = '<p style="margin:0 0 10px;font-family:Georgia,Tahoma,serif;font-size:27px">Matcha Mori</p><p style="margin:0 0 22px;font-size:12px;letter-spacing:2px">มัทฉะแท้ คุณภาพพรีเมียม</p><h1 style="margin:0 0 12px;font-size:35px;line-height:1.12">ยินดีต้อนรับคุณ<br>' . $name . '<br>เข้าสู่ครอบครัวมัทฉะของเรา</h1><p style="margin:0 0 18px;font-size:16px">ขอบคุณที่สมัครสมาชิก<br>บัญชีของคุณพร้อมใช้งานแล้ว</p><table role="presentation" cellspacing="8" cellpadding="0" style="margin-left:-8px"><tr><td style="padding:10px 13px;background:rgba(237,241,220,.92);border-radius:10px"><strong>100 Points</strong><br><span style="font-size:12px">ต้อนรับสมาชิกใหม่</span></td><td style="padding:10px 13px;background:rgba(237,241,220,.92);border-radius:10px"><strong>ลด 12%</strong><br><span style="font-size:12px">โค้ด MATCHA12</span></td></tr></table>';
        } else {
            $content = '<p style="margin:0 0 10px;font-family:Georgia,Tahoma,serif;font-size:27px">Matcha Mori</p><p style="margin:0 0 22px;font-size:12px;letter-spacing:2px">มัทฉะแท้ คุณภาพพรีเมียม</p><h1 style="margin:0 0 18px;font-size:39px;line-height:1.12">ขอบคุณที่<br>สมัครรับข่าวสาร</h1><p style="margin:0 0 8px;font-size:17px"><strong>อีเมล ' . $email . '</strong></p><p style="margin:0 0 20px;font-size:15px">ถูกเพิ่มในรายชื่อรับข่าวสารเรียบร้อยแล้ว</p><p style="margin:0;font-size:15px">อัปเดตมัทฉะใหม่ สูตรชงง่าย ๆ<br>และโปรโมชั่นจากร้าน</p>';
        }
        $html = '<!doctype html><html lang="th"><meta charset="utf-8"><body style="margin:0;background:#f3eddf;color:#123c29;font-family:Tahoma,Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:12px"><table role="presentation" width="760" height="507" cellspacing="0" cellpadding="0" background="cid:' . $cid . '" style="width:100%;max-width:760px;height:507px;background:#fffdf7 url(cid:' . $cid . ') center/cover no-repeat"><tr><td width="52%" valign="top" style="padding:38px 16px 24px 38px">' . $content . '<p style="margin:22px 0 0"><a href="' . escape($url) . '" style="display:inline-block;padding:13px 22px;border-radius:999px;background:#315d3f;color:#fff;text-decoration:none;font-weight:bold">' . escape($cta) . ' &nbsp;→</a></p></td><td width="48%">&nbsp;</td></tr></table>' . $footer . '</td></tr></table></body></html>';
        $text = html_entity_decode(strip_tags($body), ENT_QUOTES, 'UTF-8') . "\n" . $cta . ': ' . $url;
        if (isset($unsubscribe)) $text .= "\nยกเลิกรับข่าวสาร: " . $unsubscribe;
        return [$subject,$html,$text];
    }
    $hero = '<tr><td><img src="cid:newsletter-hero-v2" width="600" style="width:100%;height:auto;display:block" alt="มัทฉะลาเต้ Matcha Mori"></td></tr>';
    $html = '<!doctype html><html lang="th"><meta charset="utf-8"><body style="margin:0;background:#eee9dc;color:#183b2a;font-family:Tahoma,Arial,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:18px 8px"><table role="presentation" width="100%" style="max-width:600px;background:#fffdf7;border-radius:18px;overflow:hidden"><tr><td style="padding:25px 30px;background:#fffdf7;color:#123c29;font-family:Georgia,Tahoma,serif;font-size:30px">Matcha Mori<br><span style="font-family:Tahoma,Arial,sans-serif;font-size:14px;letter-spacing:2px">มัทฉะแท้ คุณภาพพรีเมียม</span></td></tr>' . $hero . '<tr><td style="padding:32px;line-height:1.8">' . $body . '<p style="margin:26px 0"><a style="display:inline-block;padding:15px 26px;border-radius:999px;background:#587635;color:white;text-decoration:none;font-weight:bold" href="' . escape($url) . '">' . escape($cta) . ' &nbsp;→</a></p>' . $footer . '<p style="margin-top:32px;padding-top:18px;border-top:1px solid #d9ddc8;color:#71806e;font-size:12px;letter-spacing:1px">GOOD MATCHA · BRIGHTER DAYS</p></td></tr></table></td></tr></table></body></html>';
    $text = html_entity_decode(strip_tags(str_replace(['</p>','</h2>','</div>'],"\n",$body)), ENT_QUOTES, 'UTF-8') . "\n" . $cta . ': ' . $url;
    if (isset($unsubscribe)) $text .= "\nยกเลิกรับข่าวสาร: " . $unsubscribe;
    return [$subject,$html,$text];
}
