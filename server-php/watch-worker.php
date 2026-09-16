<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
fwrite(STDOUT, "Matcha Mori mail worker is watching the queue. Press Ctrl+C to stop.\n");
$worker = __DIR__ . DIRECTORY_SEPARATOR . 'worker.php';
while (true) {
    passthru(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($worker));
    sleep(10);
}
