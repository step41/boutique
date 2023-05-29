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
            CREATE FULLTEXT INDEX FT_stocks_color_size_sku
                ON `stocks` (`color`, `size`, `sku`)
                WITH parser ngram
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::connection('mysql')->statement('ALTER TABLE `stocks` DROP INDEX FT_stocks_color_size_sku;');
    }
};
