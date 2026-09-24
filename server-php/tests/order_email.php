<?php
declare(strict_types=1);
require dirname(__DIR__) . '/orderEmail.php';

function expectOrderEmail(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

$order = [
    'orderNumber' => 'MM-ABC1234567',
    'customerName' => '<script>alert(1)</script>',
    'createdAtLabel' => '17 ก.ย. 2569 20:30',
    'items' => [[
        'name' => 'Daily Matcha Set',
        'quantity' => 2,
        'unitPrice' => 1290,
        'lineTotal' => 2580,
        'options' => ['selectedMatcha' => 'Premium Blend'],
    ]],
    'subtotal' => 2580,
    'discount' => 310,
    'shippingFee' => 0,
    'total' => 2270,
    'couponCode' => 'MATCHA12',
    'paymentMethodLabel' => 'พร้อมเพย์',
    'paymentStatusLabel' => 'รอตรวจสอบ',
    'shippingAddress' => [
        'recipientName' => 'วิรพงศ์',
        'phone' => '0800000000',
        'address' => 'กรุงเทพฯ',
    ],
];
[$subject, $html, $plain] = orderEmailTemplate($order, 'https://shop.example/');
expectOrderEmail(str_contains($subject, 'MM-ABC1234567'), 'Order number missing from subject');
expectOrderEmail(str_contains($html, '&lt;script&gt;alert(1)&lt;/script&gt;'), 'Customer name was not escaped');
expectOrderEmail(!str_contains($html, '<script>alert(1)</script>'), 'HTML injection found');
expectOrderEmail(str_contains($html, 'Premium Blend'), 'Package option missing');
expectOrderEmail(str_contains($html, 'MATCHA12'), 'Coupon missing');
expectOrderEmail(str_contains($plain, '2,270.00'), 'Plain-text total missing');
expectOrderEmail(str_contains($plain, 'ยังไม่ถือว่าชำระเงินสำเร็จ'), 'Pending-payment warning missing');
expectOrderEmail(!str_contains($html, 'CVV') && !str_contains($plain, 'CVV'), 'Card data must never be included');
echo "Order email tests passed. No email sent.\n";
