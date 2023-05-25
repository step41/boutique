<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;
use App\Facades\DirFileHelper as DF;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds. ~6 mins to complete.
     */
    public function run(): void
    {
        DB::disableQueryLog();
        // Truncation won't work with foreign key constraints so we'll just delete the table records since we're importing ids
        DB::table('stocks')->delete();
        $file = base_path('database/data/stocks.csv');
        $records = DF::prepForSeed($file);
        foreach ($records as $record):
            Stock::create($record);
        endforeach;
    }
}
