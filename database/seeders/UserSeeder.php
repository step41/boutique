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
        // Truncation won't work with foreign key constraints so we'll just delete the table records since we're importing ids
        DB::table('users')->delete();
        $file = base_path('database/data/users.csv');
        $records = DF::prepForSeed($file);
        foreach ($records as $record):
            // Add password hash using built-in bcrypt so we can eventually remove the password_hash and password_plain cols
            $record['password'] = $record['password_plain'];
            User::create($record);
        endforeach;
    }
}
