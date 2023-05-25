<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'admin_id',
        'product_name',
        'email',
        'password',
        'description',
        'style',
        'brand',
        'url',
        'product_type',
        'shipping_price',
        'note',
    ];

    /**
     * Get the orders for a product.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the inventory for a product.
     */
    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class);
    }

}
