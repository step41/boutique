<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'product_type',
        'product_name',
        'description',
        'style',
        'brand',
        'url',
        'shipping_price',
        'note',
    ];

    public function scopeSearch($query, $keywords)
    {
        return $query->when(
            $keywords,
            function ($query, $keywords) {
                $query->selectRaw('*, MATCH(product_name, style, brand, description) AGAINST (? IN BOOLEAN MODE) as score', [$keywords])
                ->whereRaw('MATCH(product_name, style, brand, description) AGAINST (? IN BOOLEAN MODE)', [$keywords]);
            },
            function ($query) {
                $query->latest();
            }
        );
    }

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
