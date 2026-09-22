<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'admin@skda.test')->first();

if ($user) {
    echo 'User found: ' . $user->email . ' password hash: ' . $user->password . PHP_EOL;
} else {
    echo 'No user found with email admin@skda.test' . PHP_EOL;
}
