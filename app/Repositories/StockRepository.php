<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\Stock;
use Auth;

/**
 * Stock Repository
 *
 * @package		Repositories
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class StockRepository
{
    /**
     * Get single instance
     *
     * @param  $id
     *
     * @return App/Models/Stock;
     */
    public function get($id)
    {
        $item = Stock::findOrFail($id);
        return $item;
    }

    /**
     * Get joined data
     *
     * @param  $id
     *
     * @return App/Models/Order;
     */
    public function getWithProductByUser()
    {
        $items = DB::table('stocks')
            ->select('products.product_name', 'users.id', 'stocks.*')
            ->join('products', 'stocks.product_id', '=', 'products.id')
            ->join('users', 'products.user_id', '=', 'users.id')
            ->where('user_id', Auth::user()->id)
        ;

        return $items;
    }


}