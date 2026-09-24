<?php
declare(strict_types=1);
// Pure local test: no SMTP, database, session, or network access.
require dirname(__DIR__) . '/memberRecommendations.php';

function expectRecommendation(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

$names = static fn(array $items): array => array_column($items, 'name');

$defaults = memberRecommendations('', 3);
expectRecommendation($names($defaults) === ['Ceremonial Grade', 'Premium Blend', 'Culinary Grade'], 'Default product order changed');

$latte = memberRecommendations('มัทฉะลาเต้, กลิ่นถั่ว หอมมัน', 3);
expectRecommendation($names($latte) === ['Okumidori Matcha', 'Ujihikari Matcha', 'Premium Blend'], 'Latte and nutty ranking is incorrect');

$pure = memberRecommendations('ชงดื่มเพียว ๆ, นุ่มละมุน กลมกล่อม, อูมามิ หวานนัว', 3);
expectRecommendation($names($pure) === ['Ceremonial Grade', 'Asahi Matcha', 'Ujihikari Matcha'], 'Pure smooth umami ranking is incorrect');

$baking = memberRecommendations('ทำขนมและเครื่องดื่ม', 3);
expectRecommendation(count($baking) === 3 && $baking[0]['name'] === 'Culinary Grade', 'Baking choice should lead and still provide three picks');

$section = memberRecommendationEmailSection($latte, 'https://shop.example/', dirname(__DIR__) . '/assets/email-products');
expectRecommendation(count($section['embeds']) === 3, 'Three product thumbnails should be embedded');
foreach ($latte as $product) {
    expectRecommendation(str_contains($section['html'], htmlspecialchars((string)$product['name'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')), 'Product missing from HTML');
    expectRecommendation(str_contains($section['plain'], (string)$product['name']), 'Product missing from plain text');
}
expectRecommendation(str_contains($section['html'], 'https://shop.example/#products'), 'Product collection link missing');
$unsafe = memberRecommendationEmailSection([[
    'name' => '<script>alert(1)</script>',
    'price' => '1',
    'image' => 'missing.jpg',
]], 'https://shop.example/');
expectRecommendation(!str_contains($unsafe['html'], '<script>'), 'Recommendation HTML injection');

echo "Member recommendation tests passed. No email sent.\n";
