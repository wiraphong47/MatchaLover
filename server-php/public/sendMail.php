<?php
declare(strict_types=1);
// Form endpoint matching the exercise. Queue processing/SMTP lives in worker.php.
define('FORM_SUBMISSION', true);
require __DIR__ . '/subscribe.php';
