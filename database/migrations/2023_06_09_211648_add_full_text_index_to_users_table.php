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
                CREATE FULLTEXT INDEX FT_users_name_email_shop_name_shop_domain
                    ON `users` (`name`, `email`, `shop_name`, `shop_domain`)
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
            DB::connection('mysql')->statement('ALTER TABLE `users` DROP INDEX FT_users_name_email_shop_name_shop_domain;');
        endif;
    }
};
