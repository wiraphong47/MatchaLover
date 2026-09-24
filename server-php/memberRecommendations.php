<?php
declare(strict_types=1);

/**
 * Return up to three products ranked from the exact choices stored by the
 * registration form. The JSON artifacts are generated from the React catalog,
 * so the website and the welcome email use the same labels and product facts.
 *
 * @return array<int,array<string,mixed>>
 */
function memberRecommendations(
    string $note,
    int $limit = 3,
    ?string $catalogPath = null,
    ?string $rulesPath = null
): array {
    $catalogPath ??= __DIR__ . '/catalog.json';
    $rulesPath ??= __DIR__ . '/recommendation-rules.json';
    $catalog = memberRecommendationJson($catalogPath);
    $rules = memberRecommendationJson($rulesPath);
    $labels = is_array($rules['labels'] ?? null) ? $rules['labels'] : [];
    $traitsByProduct = is_array($rules['traits'] ?? null) ? $rules['traits'] : [];
    $productOrder = is_array($rules['productOrder'] ?? null) ? $rules['productOrder'] : [];

    $labelToKey = [];
    foreach ($labels as $key => $label) {
        if (is_string($key) && is_string($label)) $labelToKey[$label] = $key;
    }
    $selected = [];
    foreach (explode(',', $note) as $rawLabel) {
        $label = trim($rawLabel);
        if ($label !== '' && isset($labelToKey[$label])) $selected[] = $labelToKey[$label];
    }
    $selected = array_values(array_unique($selected));
    $menuKeys = ['pure', 'latte', 'baking'];
    $selectedMenus = array_values(array_intersect($selected, $menuKeys));
    $selectedTraits = array_values(array_diff($selected, $menuKeys));

    $products = [];
    $catalogOrder = 0;
    foreach ($menuKeys as $menu) {
        $menuProducts = is_array($catalog[$menu] ?? null) ? $catalog[$menu] : [];
        foreach ($menuProducts as $product) {
            if (!is_array($product) || !is_string($product['name'] ?? null)) continue;
            $name = $product['name'];
            if (!isset($products[$name])) {
                $product['menus'] = [];
                $product['_catalogOrder'] = $catalogOrder++;
                $products[$name] = $product;
            }
            $products[$name]['menus'][] = $menu;
        }
    }

    $preferredOrder = array_flip($productOrder);
    $ranked = [];
    foreach ($products as $name => $product) {
        $productMenus = array_values(array_unique($product['menus'] ?? []));
        $matchedMenus = array_values(array_intersect($selectedMenus, $productMenus));
        $productTraits = is_array($traitsByProduct[$name] ?? null) ? $traitsByProduct[$name] : [];
        $matchedTraits = array_values(array_intersect($selectedTraits, $productTraits));
        // A selected drinking method is the strongest signal; taste, aroma,
        // texture and experience then decide the order within that method.
        $product['_score'] = ($matchedMenus ? 100 : 0) + (count($matchedTraits) * 10);
        $product['_order'] = $preferredOrder[$name] ?? (1000 + (int)$product['_catalogOrder']);
        $matchedKeys = array_values(array_unique(array_merge($matchedMenus, $matchedTraits)));
        $matchedLabels = [];
        foreach ($matchedKeys as $key) {
            if (is_string($labels[$key] ?? null)) $matchedLabels[] = $labels[$key];
        }
        $product['matchedPreferences'] = $matchedLabels;
        $product['reason'] = $matchedLabels
            ? 'ตรงกับความชอบ: ' . implode(' · ', array_slice($matchedLabels, 0, 2))
            : (string)($product['use'] ?? $product['note'] ?? 'คัดจากรายการยอดนิยมของ Matcha Mori');
        $ranked[] = $product;
    }

    usort($ranked, static function (array $left, array $right): int {
        return ($right['_score'] <=> $left['_score']) ?: ($left['_order'] <=> $right['_order']);
    });

    $result = array_slice($ranked, 0, max(0, min(3, $limit)));
    foreach ($result as &$product) {
        unset($product['_score'], $product['_order'], $product['_catalogOrder'], $product['menus']);
    }
    unset($product);
    return $result;
}

/** @return array<string,mixed> */
function memberRecommendationJson(string $path): array
{
    if (!is_file($path)) throw new RuntimeException('Recommendation data file not found.');
    $decoded = json_decode((string)file_get_contents($path), true, 64, JSON_THROW_ON_ERROR);
    if (!is_array($decoded)) throw new RuntimeException('Recommendation data is invalid.');
    return $decoded;
}

/**
 * Build the portable table markup and CID attachment list used by PHPMailer.
 *
 * @param array<int,array<string,mixed>> $products
 * @return array{html:string,plain:string,embeds:array<int,array{path:string,cid:string}>}
 */
function memberRecommendationEmailSection(
    array $products,
    string $siteUrl,
    ?string $assetsPath = null
): array {
    $assetsPath ??= __DIR__ . '/assets/email-products';
    if (!$products) return ['html' => '', 'plain' => '', 'embeds' => []];

    $rows = '';
    $plain = [];
    $embeds = [];
    foreach ($products as $index => $product) {
        $number = $index + 1;
        $name = memberRecommendationEscape((string)($product['name'] ?? 'Matcha Mori'));
        $thai = memberRecommendationEscape((string)($product['thai'] ?? ''));
        $note = memberRecommendationEscape((string)($product['note'] ?? ''));
        $reason = memberRecommendationEscape((string)($product['reason'] ?? ''));
        $size = memberRecommendationEscape((string)($product['size'] ?? ''));
        $priceValue = is_numeric($product['price'] ?? null) ? (float)$product['price'] : 0;
        $price = number_format($priceValue, 0, '.', ',');
        $cid = 'member-product-' . $number;
        $imageHtml = '';
        $imageName = basename((string)($product['image'] ?? ''));
        $imagePath = rtrim($assetsPath, '/\\') . DIRECTORY_SEPARATOR . $imageName;
        if ($imageName !== '' && is_file($imagePath)) {
            $embeds[] = ['path' => $imagePath, 'cid' => $cid];
            $imageHtml = '<img src="cid:' . $cid . '" width="126" alt="' . $name . '" style="display:block;width:126px;max-width:126px;height:126px;object-fit:cover;border-radius:14px">';
        }
        $rows .= '<tr><td style="padding:0 0 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f3e8;border:1px solid #e2dfce;border-radius:16px"><tr>'
            . ($imageHtml !== '' ? '<td width="150" valign="middle" style="padding:12px">' . $imageHtml . '</td>' : '')
            . '<td valign="middle" style="padding:16px 18px 16px ' . ($imageHtml !== '' ? '4px' : '18px') . '">'
            . '<p style="margin:0 0 3px;color:#7b8e52;font-size:12px;font-weight:bold;letter-spacing:1px">MATCHA PICK ' . $number . '</p>'
            . '<h3 style="margin:0 0 3px;color:#173b2a;font-size:19px">' . $name . '</h3>'
            . ($thai !== '' ? '<p style="margin:0 0 8px;color:#526151;font-size:13px">' . $thai . '</p>' : '')
            . '<p style="margin:0 0 7px;color:#315d3f;font-size:15px"><strong>฿' . $price . '</strong>' . ($size !== '' ? ' · ' . $size : '') . '</p>'
            . ($note !== '' ? '<p style="margin:0 0 5px;color:#344c3a;font-size:13px">' . $note . '</p>' : '')
            . ($reason !== '' ? '<p style="margin:0 0 12px;color:#6c796b;font-size:12px">' . $reason . '</p>' : '')
            . '<a href="' . memberRecommendationEscape($siteUrl . '#products') . '" style="display:inline-block;padding:9px 15px;border-radius:999px;background:#315d3f;color:#fff;text-decoration:none;font-size:12px;font-weight:bold">ดูสินค้านี้ &nbsp;→</a>'
            . '</td></tr></table></td></tr>';
        $plain[] = $number . '. ' . strip_tags((string)($product['name'] ?? 'Matcha Mori'))
            . ' — ฿' . $price . ($size !== '' ? ' / ' . strip_tags((string)($product['size'] ?? '')) : '')
            . ($product['reason'] ?? '' ? ' — ' . strip_tags((string)$product['reason']) : '');
    }
    $count = count($products);
    $html = '<table role="presentation" width="760" cellspacing="0" cellpadding="0" style="width:100%;max-width:760px;background:#fffdf7"><tr><td style="padding:34px 38px 24px">'
        . '<p style="margin:0 0 7px;color:#8ca05f;font-size:12px;font-weight:bold;letter-spacing:1.5px">SELECTED FOR YOU</p>'
        . '<h2 style="margin:0 0 8px;color:#173b2a;font-size:27px">มัทฉะ ' . $count . ' ชิ้นที่คัดให้คุณ</h2>'
        . '<p style="margin:0 0 22px;color:#667464;font-size:14px;line-height:1.7">จัดอันดับจากวิธีดื่ม รสชาติ กลิ่น เนื้อสัมผัส และประสบการณ์ที่คุณเลือกตอนสมัคร</p>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0">' . $rows . '</table>'
        . '<p style="margin:6px 0 0;text-align:center"><a href="' . memberRecommendationEscape($siteUrl . '#products') . '" style="color:#315d3f;font-size:13px;font-weight:bold">ดูมัทฉะทั้งหมดบนเว็บไซต์ →</a></p>'
        . '</td></tr></table>';
    return [
        'html' => $html,
        'plain' => "\n\nมัทฉะที่คัดจากความชอบของคุณ\n" . implode("\n", $plain) . "\nดูสินค้าทั้งหมด: " . $siteUrl . '#products',
        'embeds' => $embeds,
    ];
}

function memberRecommendationEscape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
