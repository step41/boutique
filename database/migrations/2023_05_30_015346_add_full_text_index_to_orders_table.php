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
            CREATE FULLTEXT INDEX FT_orders_name_street_city_state_status
                ON `orders` (`name`, `street_address`, `city`, `state`, `order_status`)
                WITH parser ngram
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::connection('mysql')->statement('ALTER TABLE `orders` DROP INDEX FT_orders_name_street_city_state_status;');
    }
};
