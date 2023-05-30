<?php

namespace App\Repositories;

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
     * @return App/Models/Stock;
     */
    public function getWithProductByUser()
    {
        $items = Stock::select('p.*', 'stocks.*')
            ->join('products AS p', 'stocks.product_id', '=', 'p.id')
            ->whereExists(function ($query) {
                $query->select('*')->from('users as u')->whereColumn('u.id', 'p.user_id')->where('user_id', Auth::user()->id);
            })
        ;

        return $items;
    }


}