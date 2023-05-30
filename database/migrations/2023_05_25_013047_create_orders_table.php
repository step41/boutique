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
                $table->text('street_address')->nullable();
                $table->text('apartment')->nullable();
                $table->text('city')->nullable();
                $table->text('state')->nullable();
                $table->string('country_code')->nullable();
                $table->text('zip')->nullable();
                $table->string('phone_number')->nullable();
                $table->text('email')->nullable();
                $table->string('name')->nullable();
                $table->string('order_status')->nullable();
                $table->text('payment_ref')->nullable();
                $table->string('transaction_id')->nullable();
                $table->integer('payment_amt_cents')->nullable();
                $table->integer('ship_charged_cents')->nullable();
                $table->integer('ship_cost_cents')->nullable();
                $table->integer('subtotal_cents')->nullable();
                $table->integer('total_cents')->nullable();
                $table->text('shipper_name')->nullable();
                $table->timestamp('payment_date')->nullable();
                $table->timestamp('shipped_date')->nullable();
                $table->text('tracking_number')->nullable();
                $table->integer('tax_total_cents')->nullable();
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
        Schema::dropIfExists('orders');
    }
};
