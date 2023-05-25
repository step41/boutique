<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use App\Facades\DirFileHelper as DF;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds. ~12 mins to complete.
     */
    public function run(): void
    {
        DB::disableQueryLog();
        // Truncation won't work with foreign key constraints so we'll just delete the table records since we're importing ids
        DB::table('orders')->delete();
        $file = base_path('database/data/orders.csv');
        $records = DF::prepForSeed($file);
        foreach ($records as $record):
            Order::create($record);
        endforeach;
    }
}
