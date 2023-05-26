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
        if (!Schema::hasTable('stocks')):
            Schema::create('stocks', function (Blueprint $table) {

                $table->id();
                $table->foreignId('product_id')->constrained();
                $table->integer('quantity');
                $table->text('color');
                $table->text('size');
                $table->double('weight');
                $table->integer('price_cents');
                $table->integer('sale_price_cents');
                $table->integer('cost_cents');
                $table->string('sku');
                $table->double('length');
                $table->double('width');
                $table->double('height');
                $table->text('note');
                $table->softDeletes();

            });
        endif;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
