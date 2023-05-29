<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stock extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = FALSE;

    protected $table = 'stocks';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'quantity',
        'color',
        'size',
        'weight',
        'price_cents',
        'sale_price_cents',
        'cost_cents',
        'sku',
        'length',
        'width',
        'height',
        'note',
    ];

    /**
     * Get the product for a given stock item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Implement full text search option
     */
    public function scopeSearch($query, $keywords)
    {
        return $query->when(
            $keywords,
            function ($query, $keywords) {
                $query->whereRaw('MATCH(color, size, sku) AGAINST (? IN BOOLEAN MODE)', [$keywords]);
            },
            function ($query) {
                $query->latest();
            }
        );
    }

    
}

