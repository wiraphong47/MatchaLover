<?php
declare(strict_types=1);

function mysqlConnection(): PDO {
    $path = __DIR__ . '/config.local.php';
    if (!is_file($path)) {
        throw new RuntimeException('Missing local MySQL configuration.');
    }
    $config = require $path;
    foreach (['host','port','database','username','password'] as $key) {
        if (!isset($config[$key]) || (string)$config[$key] === '') {
            throw new RuntimeException('Incomplete local MySQL configuration.');
        }
    }
    // Restrict DSN components to avoid injecting additional connection settings.
    if (!preg_match('/^[a-zA-Z0-9_.-]+$/D', $config['host']) ||
        !preg_match('/^[a-zA-Z0-9_]+$/D', $config['database']) ||
        !filter_var($config['port'], FILTER_VALIDATE_INT, ['options'=>['min_range'=>1,'max_range'=>65535]])) {
        throw new RuntimeException('Invalid MySQL host, database or port.');
    }
    return new PDO(
        sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $config['host'], $config['port'], $config['database']),
        $config['username'], $config['password'],
        [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
         PDO::ATTR_EMULATE_PREPARES=>false,
         PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]
    );
}
