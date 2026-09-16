<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') apiJson(405, ['message'=>'Method not allowed']);
$customer = null;
if (!empty($_SESSION['member_id'])) $customer = apiMember(mysqlConnection(), (string)$_SESSION['member_id']);
apiJson(200, ['csrf'=>apiCsrf(), 'customer'=>$customer]);
