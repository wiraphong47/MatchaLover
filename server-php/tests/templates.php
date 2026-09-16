<?php
declare(strict_types=1);
// No network, SMTP, or database writes. Run with PHP 8.2+.
require dirname(__DIR__) . '/bootstrap.php';
require dirname(__DIR__) . '/emailContent.php';
putenv('SITE_URL=https://shop.example/MatchaLover/');
putenv('API_URL=https://mail.example');
putenv('APP_KEY=local-test-only-key-not-for-production-1234');
function expect(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
$person = ['id'=>'00000000-0000-0000-0000-000000000001','email'=>'customer@example.com','full_name'=>'<script>alert(1)</script>','menu'=>'latte'];
[$subject,$html,$plain] = emailTemplate('newsletter',$person,[]);
expect(str_contains($html,'cid:newsletter-hero-v2'),'Newsletter background missing');
expect(str_contains($html,'customer@example.com'),'Recipient email missing');
expect(!str_contains($html,'<script>'),'HTML injection');
expect(str_contains($plain,'unsubscribe'),'Unsubscribe missing from plain text');
expect(str_contains($html,'https://shop.example/MatchaLover/#products'),'Shop link missing');
[$subject,$html,$plain] = emailTemplate('member',$person,[]);
expect(str_contains($html,'cid:member-welcome-background-v2'),'Member background missing');
expect(str_contains($html,'&lt;script&gt;alert(1)&lt;/script&gt;'),'Escaped member name missing');
[$subject,$html,$plain] = emailTemplate('confirm',$person,['token'=>str_repeat('a',64)]);
expect(str_contains($html,'24'),'Token lifetime copy missing');
expect(str_contains($plain,'confirm.php?'),'Confirmation URL missing');
echo "Template tests passed. No email sent.\n";
