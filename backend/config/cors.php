<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_values(array_unique([
        env('FRONTEND_URL', 'http://localhost:3000'),
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://192.168.1.8:3000',
        'http://192.168.160.1:3000',
        'http://192.168.50.1:3000',
    ])),
    'allowed_origins_patterns' => [
        '/^http:\/\/192\.168\.160\.\d{1,3}:3000$/',
        '/^http:\/\/192\.168\.50\.\d{1,3}:3000$/',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];