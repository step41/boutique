<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Helpers\Utilities;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();
        $file = base_path('database/data/users.csv');
        $records = Utilities::csvImport($file);
        foreach ($records as $r):
            User::create([
                'id' => $r['id'],
                'name' => $r['name'],
                'email' => $r['email'],
                'password' => $r['password_plain'],
                'password_hash' => $r['password_hash'],
                'password_plain' => $r['password_plain'],
                'superadmin' => $r['superadmin'],
                'shop_name' => $r['shop_name'],
                'remember_token' => $r['remember_token'],
                'created_at' => $r['created_at'],
                'updated_at' => $r['updated_at'],
                'card_brand' => $r['card_brand'],
                'card_last_four' => $r['card_last_four'],
                'trial_ends_at' => $r['trial_ends_at'],
                'shop_domain' => $r['shop_domain'],
                'is_enabled' => $r['is_enabled'],
                'billing_plan' => $r['billing_plan'],
                'trial_starts_at' => $r['trial_starts_at'],
            ]);
        endforeach;
    }
}
