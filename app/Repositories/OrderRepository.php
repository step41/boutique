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
        $items = Order::select('p.*', 'orders.*')
            ->join('products AS p', 'orders.product_id', '=', 'p.id')
            ->join('stocks', 'orders.stock_id', '=', 'stocks.id')
            ->whereExists(function ($query) {
                $query->select('*')->from('users as u')->whereColumn('u.id', 'p.user_id')->where('user_id', Auth::user()->id);
            })
        ;

        return $items;
    }

    /**
     * Get total sales 
     *
     * @param  $id
     *
     * @return App/Models/Order;
     */
    public function getTotalSalesForAllOrdersByUser()
    {
        $sum = Order::select('p.*', 'orders.*')
            ->join('products AS p', 'orders.product_id', '=', 'p.id')
            ->join('stocks', 'orders.stock_id', '=', 'stocks.id')
            ->whereExists(function ($query) {
                $query->select('*')->from('users as u')->whereColumn('u.id', 'p.user_id')->where('user_id', Auth::user()->id);
            })->sum(\DB::raw('orders.total_cents + orders.tax_total_cents'))
        ;

        $sum = ($sum) ? $sum / 100 : 0;
        return '$'.number_format($sum, 2);
    }

    /**
     * Get average sales 
     *
     * @param  $id
     *
     * @return App/Models/Order;
     */
    public function getAverageSalesForAllOrdersByUser()
    {
        $avg = Order::select('p.*', 'orders.*')
            ->join('products AS p', 'orders.product_id', '=', 'p.id')
            ->join('stocks', 'orders.stock_id', '=', 'stocks.id')
            ->whereExists(function ($query) {
                $query->select('*')->from('users as u')->whereColumn('u.id', 'p.user_id')->where('user_id', Auth::user()->id);
            })->avg(\DB::raw('orders.total_cents + orders.tax_total_cents'))
        ;

        $avg = ($avg) ? $avg / 100 : 0;
        return '$'.number_format($avg, 2);
    }


}