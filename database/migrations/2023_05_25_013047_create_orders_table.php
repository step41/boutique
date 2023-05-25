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
                $table->integer('product_id');
                $table->text('street_address');
                $table->text('apartment');
                $table->text('city');
                $table->text('state');
                $table->text('zip');
                $table->string('country_code');
                $table->string('phone_number');
                $table->text('email');
                $table->string('name');
                $table->string('order_status');
                $table->text('payment_ref');
                $table->string('transaction_id');
                $table->integer('payment_amt_cents');
                $table->integer('ship_charged_cents');
                $table->integer('ship_cost_cents');
                $table->integer('subtotal_cents');
                $table->integer('total_cents');
                $table->text('shipper_name');
                $table->timestamp('payment_date');
                $table->timestamp('shipped_date');
                $table->text('tracking_number');
                $table->integer('tax_total_cents');
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
