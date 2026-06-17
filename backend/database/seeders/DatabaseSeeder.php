<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1 Admin account
        User::create([
            'name'              => 'Admin',
            'username'          => 'admin',
            'email'             => 'admin@edudash.com',
            'password'          => Hash::make('password123'),
            'role'              => 'admin',
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        // 15 regular users
        $users = [
            ['name' => 'Alice Martin',    'username' => 'alice',    'email' => 'alice@example.com'],
            ['name' => 'Bob Johnson',     'username' => 'bob',      'email' => 'bob@example.com'],
            ['name' => 'Clara Davis',     'username' => 'clara',    'email' => 'clara@example.com'],
            ['name' => 'David Wilson',    'username' => 'david',    'email' => 'david@example.com'],
            ['name' => 'Emma Brown',      'username' => 'emma',     'email' => 'emma@example.com'],
            ['name' => 'Frank Miller',    'username' => 'frank',    'email' => 'frank@example.com'],
            ['name' => 'Grace Taylor',    'username' => 'grace',    'email' => 'grace@example.com'],
            ['name' => 'Henry Anderson', 'username' => 'henry',    'email' => 'henry@example.com'],
            ['name' => 'Isla Thomas',     'username' => 'isla',     'email' => 'isla@example.com'],
            ['name' => 'Jack White',      'username' => 'jack',     'email' => 'jack@example.com'],
            ['name' => 'Karen Harris',    'username' => 'karen',    'email' => 'karen@example.com'],
            ['name' => 'Liam Jackson',    'username' => 'liam',     'email' => 'liam@example.com'],
            ['name' => 'Mia Lewis',       'username' => 'mia',      'email' => 'mia@example.com'],
            ['name' => 'Noah Clark',      'username' => 'noah',     'email' => 'noah@example.com'],
            ['name' => 'Olivia Hall',     'username' => 'olivia',   'email' => 'olivia@example.com'],
        ];

        foreach ($users as $user) {
            User::create([
                'name'              => $user['name'],
                'username'          => $user['username'],
                'email'             => $user['email'],
                'password'          => Hash::make('password123'),
                'role'              => 'user',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]);
        }

        $this->call([
            BadgeSeeder::class,
        ]);
    }
}