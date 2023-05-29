<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::connection('mysql')->statement('
            CREATE FULLTEXT INDEX FT_products_name_style_brand_desc
                ON `products` (`product_name`, `style`, `brand`, `description`)
                WITH parser ngram
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::connection('mysql')->statement('ALTER TABLE `products` DROP INDEX FT_products_name_style_brand_desc;');
    }
};
