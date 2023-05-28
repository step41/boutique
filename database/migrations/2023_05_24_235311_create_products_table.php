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
                $table->foreignId('user_id')->constrained();
                $table->string('product_type');
                $table->string('product_name');
                $table->text('description');
                $table->text('style');
                $table->text('brand');
                $table->string('url')->nullable();
                $table->integer('shipping_price')->nullable();
                $table->text('note')->nullable();
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
        Schema::dropIfExists('products');
    }
};
