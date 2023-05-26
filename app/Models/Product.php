<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $table = 'products';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
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
     * Get the stock for a product.
     */
    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class);
    }

    /**
     * Get the user for a given product.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
