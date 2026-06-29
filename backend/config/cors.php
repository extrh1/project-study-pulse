<?php

return [
    'paths' => [
        'api/*',
        'storage/*',
        'sanctum/csrf-cookie'
    ],

'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    'supports_credentials' => true,
];