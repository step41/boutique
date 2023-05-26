<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('users')):
            Schema::create('users', function (Blueprint $table) {

                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->string('password_hash');
                $table->string('password_plain');
                $table->boolean('superadmin');
                $table->string('shop_name');
                $table->string('shop_domain');
                $table->string('billing_plan');
                $table->timestamp('trial_starts_at');
                $table->timestamp('trial_ends_at');
                $table->string('card_brand');
                $table->string('card_last_four');
                $table->boolean('is_enabled');
                $table->rememberToken();
                $table->timestamps();
                $table->softDeletes();
                
            });
        endif;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
