<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\Product;
use Auth;

/**
 * Product Repository
 *
 * @package		Repositories
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class ProductRepository
{
    /**
     * Get single instance
     *
     * @param  $id
     *
     * @return App/Models/Product;
     */
    public function get($id)
    {
        $item = Product::findOrFail($id);
        return $item;
    }

    /**
     * Get joined data
     *
     * @param  $id
     *
     * @return App/Models/Order;
     */
    public function getWithStocksAndOrdersByUser()
    {
        $items = DB::table('products')
            ->select('stocks.quantity', 'stocks.sku', 'products.*')
            ->join('stocks', 'products.id', '=', 'stocks.product_id')
            ->join('orders', 'products.id', '=', 'orders.product_id')
            ->join('users', 'products.user_id', '=', 'users.id')
            ->where('user_id', Auth::user()->id)
        ;

        return $items;
    }


}