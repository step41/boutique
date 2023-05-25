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
        if (!Schema::hasTable('products')):
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->integer('admin_id');
                $table->string('product_type');
                $table->string('product_name');
                $table->text('description');
                $table->text('style');
                $table->text('brand');
                $table->string('url');
                $table->integer('shipping_price');
                $table->text('note');
                $table->timestamps();
            });
        endif;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};