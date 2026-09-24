<?php
declare(strict_types=1);

function orderDisplayNumber(string $id): string
{
    return 'MM-' . strtoupper(substr(str_replace('-', '', $id), 0, 10));
}

function orderEmailEscape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function orderMoney(float|int|string $value): string
{
    return '฿' . number_format((float)$value, 2, '.', ',');
}

/**
 * @param array<string,mixed> $order
 * @return array{0:string,1:string,2:string}
 */
function orderEmailTemplate(array $order, string $siteUrl): array
{
    $number = orderEmailEscape((string)$order['orderNumber']);
    $name = orderEmailEscape((string)$order['customerName']);
    $createdAt = orderEmailEscape((string)$order['createdAtLabel']);
    $shipping = is_array($order['shippingAddress'] ?? null) ? $order['shippingAddress'] : [];
    $recipient = orderEmailEscape((string)($shipping['recipientName'] ?? $order['customerName']));
    $phone = orderEmailEscape((string)($shipping['phone'] ?? ''));
    $address = nl2br(orderEmailEscape((string)($shipping['address'] ?? '')));
    $postalCode = trim((string)($shipping['postalCode'] ?? ''));
    if ($postalCode !== '' && !str_contains((string)($shipping['address'] ?? ''), $postalCode)) {
        $address .= ' ' . orderEmailEscape($postalCode);
    }
    $paymentMethod = orderEmailEscape((string)$order['paymentMethodLabel']);
    $paymentStatus = orderEmailEscape((string)$order['paymentStatusLabel']);
    $rows = '';
    $plainItems = [];
    foreach ($order['items'] as $item) {
        $itemName = orderEmailEscape((string)$item['name']);
        $quantity = (int)$item['quantity'];
        $unit = orderMoney($item['unitPrice']);
        $line = orderMoney($item['lineTotal']);
        $option = '';
        if (is_array($item['options'] ?? null) && !empty($item['options']['selectedMatcha'])) {
            $option = '<br><span style="color:#778373;font-size:12px">มัทฉะในชุด: ' . orderEmailEscape((string)$item['options']['selectedMatcha']) . '</span>';
        }
        $rows .= '<tr><td style="padding:13px 0;border-bottom:1px solid #e5e1d6;color:#203c2a">' . $itemName . $option
            . '<br><span style="color:#778373;font-size:12px">' . $unit . ' × ' . $quantity . '</span></td>'
            . '<td align="right" valign="top" style="padding:13px 0;border-bottom:1px solid #e5e1d6;color:#203c2a;font-weight:bold;white-space:nowrap">' . $line . '</td></tr>';
        $plainItems[] = '- ' . strip_tags((string)$item['name']) . ' × ' . $quantity . ' = ' . $line;
    }
    $discountRow = (float)$order['discount'] > 0
        ? '<tr><td style="padding:5px 0;color:#547d3b">ส่วนลด' . (!empty($order['couponCode']) ? ' (' . orderEmailEscape((string)$order['couponCode']) . ')' : '') . '</td><td align="right" style="padding:5px 0;color:#547d3b">-' . orderMoney($order['discount']) . '</td></tr>'
        : '';
    $site = orderEmailEscape(rtrim($siteUrl, '/') . '/');
    $subject = 'ยืนยันคำสั่งซื้อ #' . $order['orderNumber'] . ' · Matcha Mori';
    $html = '<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        . '<body style="margin:0;background:#f2eddf;color:#183b2a;font-family:Tahoma,Arial,sans-serif">'
        . '<div style="display:none;max-height:0;overflow:hidden">เราได้รับคำสั่งซื้อ ' . $number . ' แล้ว และกำลังตรวจสอบการชำระเงิน</div>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:18px 10px">'
        . '<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#fffdf8;border-radius:18px;overflow:hidden">'
        . '<tr><td style="padding:30px 34px;background:#173b2a;color:#fffdf8"><p style="margin:0 0 7px;color:#dce8b8;font-size:12px;font-weight:bold;letter-spacing:1.5px">MATCHA MORI · ORDER RECEIVED</p>'
        . '<h1 style="margin:0;font-size:31px;line-height:1.25">เราได้รับคำสั่งซื้อ<br>ของคุณแล้ว</h1></td></tr>'
        . '<tr><td style="padding:30px 34px"><p style="margin:0 0 8px">สวัสดีคุณ <strong>' . $name . '</strong></p>'
        . '<p style="margin:0 0 22px;color:#5f6e61;line-height:1.75">ขอบคุณที่เลือก Matcha Mori คำสั่งซื้อถูกบันทึกเรียบร้อยแล้ว และกำลังรอตรวจสอบหลักฐานการชำระเงิน อีเมลฉบับนี้ยังไม่ใช่การยืนยันว่าชำระเงินสำเร็จ</p>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf1dc;border-radius:12px"><tr><td style="padding:16px"><span style="color:#6a7869;font-size:12px">เลขคำสั่งซื้อ</span><br><strong style="font-size:18px">' . $number . '</strong></td>'
        . '<td align="right" style="padding:16px"><span style="color:#6a7869;font-size:12px">วันที่สั่งซื้อ</span><br><strong>' . $createdAt . '</strong></td></tr></table>'
        . '<h2 style="margin:28px 0 8px;font-size:21px">รายการสินค้า</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0">' . $rows . '</table>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px"><tr><td style="padding:5px 0;color:#647064">ยอดสินค้า</td><td align="right" style="padding:5px 0">' . orderMoney($order['subtotal']) . '</td></tr>'
        . $discountRow
        . '<tr><td style="padding:5px 0;color:#647064">ค่าจัดส่ง</td><td align="right" style="padding:5px 0">' . orderMoney($order['shippingFee']) . '</td></tr>'
        . '<tr><td style="padding:14px 0 0;border-top:1px solid #d9ddce;font-size:18px;font-weight:bold">ยอดรวม</td><td align="right" style="padding:14px 0 0;border-top:1px solid #d9ddce;color:#a47736;font-size:22px;font-weight:bold">' . orderMoney($order['total']) . '</td></tr></table>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px"><tr><td width="50%" valign="top" style="padding:16px;background:#f6f2e8"><strong>การชำระเงิน</strong><br><span style="color:#657267;font-size:13px;line-height:1.7">' . $paymentMethod . '<br>' . $paymentStatus . '</span></td>'
        . '<td width="50%" valign="top" style="padding:16px;background:#f6f2e8"><strong>จัดส่งถึง</strong><br><span style="color:#657267;font-size:13px;line-height:1.7">' . $recipient . '<br>' . $phone . '<br>' . $address . '</span></td></tr></table>'
        . '<p style="margin:26px 0 8px;text-align:center"><a href="' . $site . '" style="display:inline-block;padding:13px 22px;border-radius:999px;background:#315d3f;color:#fff;text-decoration:none;font-weight:bold">กลับไปที่เว็บไซต์ Matcha Mori →</a></p>'
        . '<p style="margin:24px 0 0;padding-top:18px;border-top:1px solid #e2dfd4;color:#7b8579;font-size:11px;line-height:1.6">อีเมลนี้เป็นข้อมูลธุรกรรมจากคำสั่งซื้อของคุณ หากข้อมูลไม่ถูกต้อง กรุณาติดต่อร้านพร้อมแจ้งเลขคำสั่งซื้อ</p>'
        . '</td></tr></table></td></tr></table></body></html>';
    $plainAddress = strip_tags((string)($shipping['address'] ?? ''));
    if ($postalCode !== '' && !str_contains($plainAddress, $postalCode)) {
        $plainAddress .= ' ' . $postalCode;
    }
    $plain = "เราได้รับคำสั่งซื้อของคุณแล้ว\nเลขคำสั่งซื้อ: {$order['orderNumber']}\nวันที่: {$order['createdAtLabel']}\n\n"
        . implode("\n", $plainItems)
        . "\n\nยอดสินค้า: " . orderMoney($order['subtotal'])
        . ((float)$order['discount'] > 0 ? "\nส่วนลด: -" . orderMoney($order['discount']) : '')
        . "\nค่าจัดส่ง: " . orderMoney($order['shippingFee'])
        . "\nยอดรวม: " . orderMoney($order['total'])
        . "\nการชำระเงิน: {$order['paymentMethodLabel']} · {$order['paymentStatusLabel']}"
        . "\nจัดส่งถึง: " . strip_tags((string)($shipping['recipientName'] ?? $order['customerName'])) . ' · ' . strip_tags((string)($shipping['phone'] ?? '')) . ' · ' . $plainAddress
        . "\n\nคำสั่งซื้อนี้กำลังรอตรวจสอบการชำระเงิน และยังไม่ถือว่าชำระเงินสำเร็จ\n" . rtrim($siteUrl, '/') . '/';
    return [$subject, $html, $plain];
}

/**
 * Send order confirmation email using PHPMailer and local configuration.
 *
 * @param array<string,mixed> $order
 * @param string|null $configPath
 * @return bool
 */
function sendOrderEmail(array $order, ?string $configPath = null): bool
{
    try {
        $baseDir = __DIR__;
        $autoloadPath = $baseDir . '/vendor/autoload.php';
        if (!file_exists($autoloadPath)) {
            return false;
        }
        require_once $autoloadPath;
        $configFile = $configPath ?: ($baseDir . '/config.local.php');
        if (!file_exists($configFile)) {
            return false;
        }
        $mailConfig = require $configFile;
        $siteUrl = (string)($mailConfig['SITE_URL'] ?? 'https://wiraphong47.github.io/MatchaLover/');
        [$subject, $html, $plain] = orderEmailTemplate($order, $siteUrl);

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
        $mail->Encoding = 'base64';
        $mail->setFrom($mailConfig['MAIL_FROM'], 'Matcha Mori');
        $mail->addAddress($order['customerEmail']);
        $mail->Subject = $subject;
        $mail->isHTML(true);
        $mail->Body = $html;
        $mail->AltBody = $plain;
        $mail->send();
        return true;
    } catch (Throwable $mailError) {
        error_log('Order confirmation email failed: ' . get_class($mailError) . ' ' . $mailError->getMessage());
        return false;
    }
}
