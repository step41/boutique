<?php

namespace App\Repositories;

use App\Product;

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
     * Get all active products
     *
     * @return \App\Product Collection;
     */
    public function getAllActiveProducts()
    {
        $items = Product::where('is_active', 1)->get();
        return $items;
    }

    /**
     * Get active product by id
     *
     * @param  $id
     *
     * @return App/Models/Product;
     */
    public function getActiveProduct($id)
    {
        $item = Product::where('is_active', 1)->findOrFail($id);
        return $item;
    }

    /**
     * Get active product by slug
     *
     * @param  $slug
     *
     * @return App/Models/Product;
     */
    public function getActiveProductBySlug($slug)
    {
        $item = Product::where('slug', $slug)->where('is_active', 1)->first();
        return $item;
    }

}