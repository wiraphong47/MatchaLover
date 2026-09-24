<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require_once dirname(__DIR__, 2) . '/orderEmail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') apiJson(405, ['message' => 'Method not allowed']);
apiRequireCsrf();
$memberId = apiUserId();
$contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
if (str_starts_with($contentType, 'multipart/form-data')) {
    $rawOrder = $_POST['order'] ?? '';
    if (!is_string($rawOrder) || $rawOrder === '' || strlen($rawOrder) > 32768) {
        apiJson(400, ['message' => 'ข้อมูลคำสั่งซื้อไม่ถูกต้อง']);
    }
    try {
        $body = json_decode($rawOrder, true, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        apiJson(400, ['message' => 'รูปแบบข้อมูลคำสั่งซื้อไม่ถูกต้อง']);
    }
    if (!is_array($body)) apiJson(400, ['message' => 'รูปแบบข้อมูลคำสั่งซื้อไม่ถูกต้อง']);
} else {
    $body = apiBody();
}
$db = mysqlConnection();

if (($body['action'] ?? '') === 'resend_email' || ($_GET['action'] ?? '') === 'resend_email') {
    $orderId = apiText($body['orderId'] ?? $_GET['orderId'] ?? '', 80);
    if ($orderId === '') apiJson(422, ['message' => 'ไม่พบรหัสคำสั่งซื้อ']);
    $order = orderApiSummary($db, $orderId, $memberId);
    $sent = sendOrderEmail($order);
    if ($sent) {
        apiJson(200, [
            'ok' => true,
            'emailSent' => true,
            'message' => 'ส่งสรุปคำสั่งซื้อไปที่ ' . $order['customerEmail'] . ' เรียบร้อยแล้ว',
            'order' => $order,
        ]);
    }
    apiJson(500, [
        'ok' => false,
        'emailSent' => false,
        'message' => 'ส่งอีเมลไม่สำเร็จ กรุณาตรวจสอบการตั้งค่าอีเมลหรือลองใหม่อีกครั้ง',
    ]);
}

$rawIdempotencyKey = $body['idempotencyKey'] ?? null;
if (!is_string($rawIdempotencyKey) || strlen($rawIdempotencyKey) > 80) {
    apiJson(422, ['message' => 'รหัสคำขอสั่งซื้อไม่ถูกต้อง กรุณาลองใหม่']);
}
$idempotencyKey = trim($rawIdempotencyKey);
$couponCode = strtoupper(apiText($body['couponCode'] ?? '', 40));
$paymentMethod = apiText($body['paymentMethod'] ?? '', 30);
$inputItems = $body['items'] ?? null;

if (!preg_match('/^[a-zA-Z0-9_-]{16,80}$/D', $idempotencyKey)) {
    apiJson(422, ['message' => 'รหัสคำขอสั่งซื้อไม่ถูกต้อง กรุณาลองใหม่']);
}
if (!is_array($inputItems) || !$inputItems || count($inputItems) > 30) {
    apiJson(422, ['message' => 'กรุณาเลือกสินค้าอย่างน้อยหนึ่งรายการ']);
}
if (!in_array($paymentMethod, ['promptpay', 'bank_transfer'], true)) {
    apiJson(422, ['message' => 'วิธีชำระเงินไม่ถูกต้อง']);
}
$uploadedSlip = orderApiValidateSlip($_FILES['slip'] ?? null);

$normalizedItems = [];
foreach ($inputItems as $item) {
    if (!is_array($item)) apiJson(422, ['message' => 'ข้อมูลสินค้าไม่ถูกต้อง']);
    $productId = apiText($item['productId'] ?? '', 80);
    $selectedMatchaId = apiText($item['selectedMatchaId'] ?? '', 80);
    $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 99],
    ]);
    if ($productId === '' || $quantity === false) {
        apiJson(422, ['message' => 'จำนวนหรือรหัสสินค้าไม่ถูกต้อง']);
    }
    $lineKey = $productId . '|' . $selectedMatchaId;
    if (isset($normalizedItems[$lineKey])) {
        $normalizedItems[$lineKey]['quantity'] += $quantity;
        if ($normalizedItems[$lineKey]['quantity'] > 99) apiJson(422, ['message' => 'จำนวนสินค้าสูงสุด 99 ชิ้นต่อรายการ']);
    } else {
        $normalizedItems[$lineKey] = [
            'productId' => $productId,
            'selectedMatchaId' => $selectedMatchaId,
            'quantity' => $quantity,
        ];
    }
}
$normalizedItems = array_values($normalizedItems);

$memberStatement = $db->prepare("SELECT m.email,m.full_name,m.phone,a.recipient_name,a.phone AS address_phone,a.address,a.postal_code
    FROM members m LEFT JOIN addresses a ON a.member_id=m.id
    WHERE m.id=? ORDER BY a.created_at DESC LIMIT 1");
$memberStatement->execute([$memberId]);
$member = $memberStatement->fetch();
if (!$member) apiJson(401, ['message' => 'ไม่พบบัญชีสมาชิก']);

$shippingInput = is_array($body['shippingAddress'] ?? null) ? $body['shippingAddress'] : null;
$shippingRecipient = apiText($shippingInput['recipientName'] ?? $member['recipient_name'] ?: $member['full_name'], 150);
$shippingPhone = apiText($shippingInput['phone'] ?? $member['address_phone'] ?: $member['phone'], 30);
$shippingAddressText = apiText($shippingInput['address'] ?? $member['address'] ?? '', 4000);
$shippingPostal = apiText($shippingInput['postalCode'] ?? $member['postal_code'] ?? '', 20);

if (trim($shippingAddressText) === '') {
    apiJson(422, ['message' => 'กรุณาระบุที่อยู่สำหรับจัดส่งสินค้า']);
}

$orderId = null;
$created = false;
$savedSlipPath = null;
$savedSlipAbsolute = null;
try {
    $db->beginTransaction();
    $existingStatement = $db->prepare('SELECT id FROM orders WHERE member_id=? AND idempotency_key=? FOR UPDATE');
    $existingStatement->execute([$memberId, $idempotencyKey]);
    $existing = $existingStatement->fetch();
    if ($existing) {
        $orderId = $existing['id'];
        $db->commit();
    } else {
        $productStatement = $db->prepare('SELECT id,name,category,price,details FROM products WHERE id=? AND active=1');
        $matchaStatement = $db->prepare("SELECT id,name,price FROM products WHERE id=? AND category='matcha' AND active=1");
        $orderItems = [];
        $subtotal = 0.0;
        foreach ($normalizedItems as $position => $inputItem) {
            $productStatement->execute([$inputItem['productId']]);
            $product = $productStatement->fetch();
            if (!$product) orderApiAbort($db, 422, 'มีสินค้าบางรายการที่ไม่พร้อมจำหน่าย กรุณาตรวจตะกร้าอีกครั้ง');
            $unitPrice = (float)$product['price'];
            $snapshotName = (string)$product['name'];
            $options = ['position' => $position];
            if ($product['category'] === 'package') {
                if ($inputItem['selectedMatchaId'] === '') orderApiAbort($db, 422, 'กรุณาเลือกมัทฉะสำหรับแพ็กเกจ');
                $matchaStatement->execute([$inputItem['selectedMatchaId']]);
                $selectedMatcha = $matchaStatement->fetch();
                if (!$selectedMatcha) orderApiAbort($db, 422, 'มัทฉะที่เลือกในแพ็กเกจไม่พร้อมจำหน่าย');
                $details = json_decode((string)($product['details'] ?? ''), true);
                $accessoryPrice = is_array($details) && is_numeric($details['accessoryPrice'] ?? null)
                    ? (float)$details['accessoryPrice'] : null;
                $discountRate = is_array($details) && is_numeric($details['discountRate'] ?? null)
                    ? (float)$details['discountRate'] : null;
                if ($accessoryPrice === null || $discountRate === null || $discountRate < 0 || $discountRate >= 1) {
                    orderApiAbort($db, 503, 'ยังไม่สามารถคำนวณราคาแพ็กเกจนี้ได้');
                }
                $unitPrice = round((($accessoryPrice + (float)$selectedMatcha['price']) * (1 - $discountRate)) / 10) * 10;
                $snapshotName .= ' · ' . $selectedMatcha['name'];
                $options['selectedMatcha'] = $selectedMatcha['name'];
                $options['selectedMatchaId'] = $selectedMatcha['id'];
            } elseif ($inputItem['selectedMatchaId'] !== '') {
                orderApiAbort($db, 422, 'ตัวเลือกมัทฉะใช้ได้เฉพาะสินค้าแบบแพ็กเกจ');
            }
            $lineTotal = $unitPrice * $inputItem['quantity'];
            $subtotal += $lineTotal;
            $orderItems[] = [
                'productId' => $product['id'],
                'name' => $snapshotName,
                'options' => $options,
                'unitPrice' => $unitPrice,
                'quantity' => $inputItem['quantity'],
                'lineTotal' => $lineTotal,
            ];
        }

        $discount = 0.0;
        $appliedCoupon = null;
        if ($couponCode !== '') {
            $couponStatement = $db->prepare('SELECT code,discount_percent FROM coupons WHERE code=? AND active=1 AND (expires_at IS NULL OR expires_at>NOW())');
            $couponStatement->execute([$couponCode]);
            $coupon = $couponStatement->fetch();
            if (!$coupon) orderApiAbort($db, 422, 'คูปองหมดอายุหรือไม่สามารถใช้งานได้');
            $discount = round($subtotal * ((float)$coupon['discount_percent'] / 100));
            $appliedCoupon = $coupon['code'];
        }
        $shippingFee = 0.0;
        $total = $subtotal - $discount + $shippingFee;
        $orderId = apiUuid();
        $shippingAddress = [
            'recipientName' => $shippingRecipient,
            'phone' => $shippingPhone,
            'address' => $shippingAddressText,
            'postalCode' => $shippingPostal,
        ];
        [$savedSlipPath, $savedSlipAbsolute] = orderApiStoreSlip($uploadedSlip);
        if ($shippingInput) {
            $db->prepare("INSERT INTO addresses(id,member_id,recipient_name,phone,address,postal_code)
                VALUES (?,?,?,?,?,?)
                ON DUPLICATE KEY UPDATE recipient_name=VALUES(recipient_name),phone=VALUES(phone),address=VALUES(address),postal_code=VALUES(postal_code)")
                ->execute([$memberId, $memberId, $shippingRecipient, $shippingPhone, $shippingAddressText, $shippingPostal]);
        }
        $db->prepare("INSERT INTO orders(id,member_id,idempotency_key,status,customer_name,customer_email,shipping_address,subtotal,discount,shipping_fee,coupon_code)
            VALUES (?,?,?,'pending_review',?,?,?,?,?,?,?)")
            ->execute([
                $orderId, $memberId, $idempotencyKey, $member['full_name'], $member['email'],
                json_encode($shippingAddress, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                $subtotal, $discount, $shippingFee, $appliedCoupon,
            ]);
        $itemInsert = $db->prepare('INSERT INTO order_items(id,order_id,product_id,name,options,unit_price,quantity) VALUES (?,?,?,?,?,?,?)');
        foreach ($orderItems as $item) {
            $itemInsert->execute([
                apiUuid(), $orderId, $item['productId'], $item['name'],
                json_encode($item['options'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                $item['unitPrice'], $item['quantity'],
            ]);
        }
        $db->prepare("INSERT INTO payments(id,order_id,method,amount,slip_path,status) VALUES (?,?,?,?,?,'pending')")
            ->execute([apiUuid(), $orderId, $paymentMethod, $total, $savedSlipPath]);
        $db->commit();
        $created = true;
    }
} catch (PDOException $error) {
    if ($db->inTransaction()) $db->rollBack();
    if ($savedSlipAbsolute && is_file($savedSlipAbsolute)) unlink($savedSlipAbsolute);
    if (($error->errorInfo[1] ?? null) === 1062) {
        $duplicate = $db->prepare('SELECT id FROM orders WHERE member_id=? AND idempotency_key=?');
        $duplicate->execute([$memberId, $idempotencyKey]);
        $orderId = $duplicate->fetchColumn() ?: null;
    }
    if (!$orderId) throw $error;
}

$order = orderApiSummary($db, (string)$orderId, $memberId);
$emailSent = null;
if ($created) {
    $emailSent = sendOrderEmail($order);
}

apiJson($created ? 201 : 200, [
    'order' => $order,
    'emailSent' => $emailSent,
    'reused' => !$created,
]);

/** @return array{tmpName:string,extension:string} */
function orderApiValidateSlip(mixed $file): array
{
    if (!is_array($file) || !isset($file['error'], $file['tmp_name'], $file['size'])) {
        apiJson(422, ['message' => 'กรุณาแนบไฟล์หลักฐานการโอนเงิน']);
    }
    if ((int)$file['error'] !== UPLOAD_ERR_OK) {
        $message = (int)$file['error'] === UPLOAD_ERR_INI_SIZE || (int)$file['error'] === UPLOAD_ERR_FORM_SIZE
            ? 'ไฟล์หลักฐานมีขนาดใหญ่เกินไป'
            : 'อัปโหลดหลักฐานการโอนไม่สำเร็จ กรุณาเลือกไฟล์ใหม่';
        apiJson(422, ['message' => $message]);
    }
    $size = (int)$file['size'];
    $tmpName = (string)$file['tmp_name'];
    if ($size < 1 || $size > 5 * 1024 * 1024 || !is_uploaded_file($tmpName)) {
        apiJson(422, ['message' => 'ไฟล์หลักฐานต้องมีขนาดไม่เกิน 5 MB']);
    }
    if (!class_exists('finfo')) apiJson(503, ['message' => 'เซิร์ฟเวอร์ยังไม่พร้อมตรวจสอบไฟล์อัปโหลด']);
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($tmpName);
    $extensions = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'application/pdf' => 'pdf',
    ];
    if (!is_string($mime) || !isset($extensions[$mime])) {
        apiJson(422, ['message' => 'รองรับสลิปเฉพาะไฟล์ JPG, PNG, WEBP หรือ PDF']);
    }
    return ['tmpName' => $tmpName, 'extension' => $extensions[$mime]];
}

/** @param array{tmpName:string,extension:string} $file @return array{0:string,1:string} */
function orderApiStoreSlip(array $file): array
{
    $directory = dirname(__DIR__, 2) . '/storage/payment-slips';
    if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
        apiJson(503, ['message' => 'ไม่สามารถจัดเก็บหลักฐานการชำระเงินได้']);
    }
    $fileName = bin2hex(random_bytes(20)) . '.' . $file['extension'];
    $absolutePath = $directory . '/' . $fileName;
    if (!move_uploaded_file($file['tmpName'], $absolutePath)) {
        apiJson(503, ['message' => 'จัดเก็บหลักฐานการชำระเงินไม่สำเร็จ กรุณาลองใหม่']);
    }
    return ['payment-slips/' . $fileName, $absolutePath];
}

function orderApiAbort(PDO $db, int $status, string $message): never
{
    if ($db->inTransaction()) $db->rollBack();
    apiJson($status, ['message' => $message]);
}

/** @return array<string,mixed> */
function orderApiSummary(PDO $db, string $orderId, string $memberId): array
{
    $statement = $db->prepare("SELECT o.*,p.method AS payment_method,p.status AS payment_status
        FROM orders o LEFT JOIN payments p ON p.order_id=o.id
        WHERE o.id=? AND o.member_id=? LIMIT 1");
    $statement->execute([$orderId, $memberId]);
    $row = $statement->fetch();
    if (!$row) apiJson(404, ['message' => 'ไม่พบคำสั่งซื้อ']);
    $itemStatement = $db->prepare('SELECT product_id,name,options,unit_price,quantity,line_total FROM order_items WHERE order_id=?');
    $itemStatement->execute([$orderId]);
    $items = [];
    foreach ($itemStatement->fetchAll() as $item) {
        $options = $item['options'] ? json_decode($item['options'], true) : [];
        $items[] = [
            'productId' => $item['product_id'],
            'name' => $item['name'],
            'options' => is_array($options) ? $options : [],
            'unitPrice' => (float)$item['unit_price'],
            'quantity' => (int)$item['quantity'],
            'lineTotal' => (float)$item['line_total'],
        ];
    }
    usort($items, static fn(array $a, array $b): int => (($a['options']['position'] ?? 0) <=> ($b['options']['position'] ?? 0)));
    $shipping = json_decode((string)$row['shipping_address'], true);
    $createdTimestamp = strtotime((string)$row['created_at']);
    $paymentMethods = ['promptpay' => 'พร้อมเพย์', 'bank_transfer' => 'โอนผ่านบัญชีธนาคาร'];
    $paymentStatuses = ['pending' => 'รอตรวจสอบ', 'verified' => 'ตรวจสอบแล้ว', 'rejected' => 'หลักฐานไม่ผ่านการตรวจสอบ'];
    return [
        'id' => $row['id'],
        'orderNumber' => orderDisplayNumber($row['id']),
        'memberId' => $row['member_id'],
        'status' => $row['status'],
        'customerName' => $row['customer_name'],
        'customerEmail' => $row['customer_email'],
        'shippingAddress' => is_array($shipping) ? $shipping : [],
        'items' => $items,
        'subtotal' => (float)$row['subtotal'],
        'discount' => (float)$row['discount'],
        'shippingFee' => (float)$row['shipping_fee'],
        'total' => (float)$row['total'],
        'couponCode' => $row['coupon_code'],
        'paymentMethod' => $row['payment_method'],
        'paymentMethodLabel' => $paymentMethods[$row['payment_method']] ?? 'ไม่ระบุ',
        'paymentStatus' => $row['payment_status'],
        'paymentStatusLabel' => $paymentStatuses[$row['payment_status']] ?? 'รอตรวจสอบ',
        'createdAt' => $createdTimestamp ? date(DATE_ATOM, $createdTimestamp) : (string)$row['created_at'],
        'createdAtLabel' => $createdTimestamp ? date('d/m/Y H:i', $createdTimestamp) : (string)$row['created_at'],
    ];
}
