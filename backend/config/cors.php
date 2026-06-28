<?php

return [
    'paths' => [
        'api/*',
        'storage/*',
        'sanctum/csrf-cookie'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'https://studypulse-ocydrgba5-extrh1s-projects.vercel.app/login'
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Authorization'
    ],

    'max_age' => 0,

    'supports_credentials' => true,
];