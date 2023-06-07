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
        if (env('APP_ENV') !== 'testing'):
            DB::connection('mysql')->statement('
                CREATE FULLTEXT INDEX FTT_products_name_style_brand_desc
                    ON `products` (`product_name`, `style`, `brand`, `description`)
                    WITH parser ngram
            ');
        endif;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (env('APP_ENV') !== 'testing'):
            DB::connection('mysql')->statement('ALTER TABLE `products` DROP INDEX FTT_products_name_style_brand_desc;');
        endif;
    }
};
