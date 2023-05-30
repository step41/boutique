<?php

namespace App\Repositories;

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
        $items = Order::select('p.*', 'orders.*')
            ->join('products AS p', 'orders.product_id', '=', 'p.id')
            ->join('stocks', 'orders.stock_id', '=', 'stocks.id')
            ->whereExists(function ($query) {
                $query->select('*')->from('users as u')->whereColumn('u.id', 'p.user_id')->where('user_id', Auth::user()->id);
            })
        ;

        return $items;
    }


}