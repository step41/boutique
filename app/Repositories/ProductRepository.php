<?php

namespace App\Repositories;

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

}