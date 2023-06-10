<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Facades\DirFileHelper as DF;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::disableQueryLog();
        DB::table('users')->delete();
        $file = base_path('database/data/users.csv');
        $records = DF::prepForSeed($file);
        foreach ($records as $record):
            // Add password hash using built-in bcrypt so we can eventually remove the password_hash and password_plain cols
            $record['password_confirm'] = $record['password_plain'];
            $record['password'] = $record['password_confirm'];
            // Remove plain and hash columns
            unset($record['password_plain'], $record['password_hash']);
            User::create($record);
        endforeach;
    }
}
