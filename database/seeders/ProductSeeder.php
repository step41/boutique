<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use App\Facades\DirFileHelper as DF;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds. ~3 mins to complete.
     */
    public function run(): void
    {
        DB::disableQueryLog();
        DB::table('products')->delete();
        $file = base_path('database/data/products.csv');
        $records = DF::prepForSeed($file);
        foreach ($records as $record):
            Product::create($record);
        endforeach;
    }
}
