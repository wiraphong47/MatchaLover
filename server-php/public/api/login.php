<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') apiJson(405, ['message'=>'Method not allowed']);
apiRequireCsrf(); $body=apiBody();
$email=strtolower(apiText($body['email'] ?? '',254)); $password=is_string($body['password'] ?? null)?$body['password']:'';
$db=mysqlConnection(); $statement=$db->prepare('SELECT id,password_hash FROM members WHERE email=? LIMIT 1'); $statement->execute([$email]); $member=$statement->fetch();
if (!$member || !password_verify($password,$member['password_hash'])) { usleep(250000); apiJson(401,['code'=>'invalid_credentials','message'=>'อีเมลหรือรหัสผ่านไม่ถูกต้อง']); }
session_regenerate_id(true); $_SESSION['member_id']=$member['id']; $_SESSION['csrf']=bin2hex(random_bytes(32));
apiJson(200,['session'=>true,'csrf'=>apiCsrf(),'customer'=>apiMember($db,$member['id'])]);
