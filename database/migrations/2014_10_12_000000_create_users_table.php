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
                $table->string('password_hash')->nullable();
                $table->string('password_plain')->nullable();
                $table->boolean('superadmin')->default(0);
                $table->string('shop_name')->nullable();
                $table->string('shop_domain')->nullable();
                $table->string('billing_plan')->nullable();
                $table->timestamp('trial_starts_at')->nullable();
                $table->timestamp('trial_ends_at')->nullable();
                $table->string('card_brand')->nullable();
                $table->string('card_last_four')->nullable();
                $table->boolean('is_enabled')->default(1);
                $table->rememberToken()->nullable();
                $table->timestamps();
                $table->softDeletes()->nullable();
                
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
