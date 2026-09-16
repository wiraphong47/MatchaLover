<?php
// Copy to config.local.php. Never commit the real SMTP password.
return [
    'SITE_URL' => 'http://localhost:5173/MatchaLover/',
    'API_URL' => 'http://127.0.0.1:8080',
    'ALLOWED_ORIGINS' => 'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,https://wiraphong47.github.io',
    'SMTP_HOST' => 'smtp.gmail.com',
    'SMTP_PORT' => '587',
    'SMTP_USERNAME' => 'your-email@gmail.com',
    'SMTP_PASSWORD' => '', // Google App Password, never your normal password.
    'MAIL_FROM' => 'your-email@gmail.com',
    'WELCOME_START_AT' => '2026-09-16 00:00:00',
    'APP_KEY' => '', // Production: a separate random value of at least 32 characters.
];
