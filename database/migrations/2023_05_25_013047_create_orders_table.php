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
        if (!Schema::hasTable('orders')):
            Schema::create('orders', function (Blueprint $table) {

                $table->id();
                $table->foreignId('product_id')->constrained();
                $table->foreignId('stock_id')->constrained();
                $table->text('street_address');
                $table->text('apartment');
                $table->text('city');
                $table->text('state');
                $table->string('country_code');
                $table->text('zip');
                $table->string('phone_number');
                $table->text('email');
                $table->string('name');
                $table->string('order_status');
                $table->text('payment_ref')->nullable();
                $table->string('transaction_id')->nullable();
                $table->integer('payment_amt_cents')->nullable();
                $table->integer('ship_charged_cents')->nullable();
                $table->integer('ship_cost_cents')->nullable();
                $table->integer('subtotal_cents')->nullable();
                $table->integer('total_cents')->nullable();
                $table->text('shipper_name');
                $table->timestamp('payment_date');
                $table->timestamp('shipped_date');
                $table->text('tracking_number');
                $table->integer('tax_total_cents')->nullable();
                $table->timestamps();

            });
        endif;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
