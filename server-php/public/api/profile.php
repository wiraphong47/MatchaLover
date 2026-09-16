<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
$id=apiUserId(); $db=mysqlConnection();
if ($_SERVER['REQUEST_METHOD']==='GET') apiJson(200,['customer'=>apiMember($db,$id),'csrf'=>apiCsrf()]);
if ($_SERVER['REQUEST_METHOD']!=='PUT') apiJson(405,['message'=>'Method not allowed']);
apiRequireCsrf(); $body=apiBody();
$name=apiText($body['name']??'',150); $phone=apiText($body['phone']??'',30); $address=apiText($body['address']??'',4000); $note=apiText($body['note']??'',4000);
$budget=($body['budget']??'')===''?null:filter_var($body['budget'],FILTER_VALIDATE_FLOAT);
if ($name==='' || $phone==='' || $budget===false || ($budget!==null && $budget<0)) apiJson(422,['message'=>'กรุณาตรวจชื่อ เบอร์โทร และงบประมาณ']);
$db->beginTransaction();
try {
    $db->prepare('UPDATE members SET full_name=?,phone=? WHERE id=?')->execute([$name,$phone,$id]);
    $db->prepare('INSERT INTO addresses(id,member_id,recipient_name,phone,address) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE recipient_name=VALUES(recipient_name),phone=VALUES(phone),address=VALUES(address)')->execute([$id,$id,$name,$phone,$address]);
    $db->prepare('INSERT INTO customer_preferences(member_id,interests,budget) VALUES (?,?,?) ON DUPLICATE KEY UPDATE interests=VALUES(interests),budget=VALUES(budget)')->execute([$id,$note,$budget]);
    $db->commit();
} catch (Throwable $error) { if($db->inTransaction())$db->rollBack(); throw $error; }
apiJson(200,['customer'=>apiMember($db,$id),'csrf'=>apiCsrf()]);
