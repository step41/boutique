<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\Order;
use Auth;

/**
 * Order Repository
 *
 * @package		Repositories
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class OrderRepository
{
    /**
     * Get single instance
     *
     * @param  $id
     *
     * @return App/Models/Order;
     */
    public function get($id)
    {
        $item = Order::findOrFail($id);
        return $item;
    }

    /**
     * Get joined data
     *
     * @param  $id
     *
     * @return App/Models/Order;
     */
    public function getWithProductsAndStocksByUser()
    {
        $items = DB::table('orders')
            ->select('products.product_name', 'orders.*')
            ->join('products', 'orders.product_id', '=', 'products.id')
            ->join('stocks', 'orders.stock_id', '=', 'stocks.id')
            ->join('users', 'products.user_id', '=', 'users.id')
            ->where('user_id', Auth::user()->id)
        ;

        return $items;
    }


}