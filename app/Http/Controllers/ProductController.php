<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Repositories\ProductRepository;
use App\Facades\Message as MSG;
use Illuminate\Http\Request;
use App\Traits\RolePermissions;
use App\Traits\ValidateFromCache;
use Auth;
use Session;

/**
 * Product Controller
 *
 * @package		Controllers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class ProductController extends Controller {

    use RolePermissions, ValidateFromCache;
    
    /**
     * Create a new controller instance.
     *
     * @param Product $model
     * @param ProductRepository $repository
     */
    public function __construct(Product $model, ProductRepository $repository) {

        $this->middleware('auth');
        $this->model = $model;
        $this->repository = $repository;
    
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {

        if ($this->userCan('delete products')):

            $product = $this->repository->get($id);

            if ($product->count()):

                // Additional check for ownership or override access
                if ($this->userHasOverride($product)):
                
                    $product->delete();

                    return MSG::success('Product deleted successfully');

                endif;
            
            else:

                return MSG::danger('Invalid product identifier');

            endif;

        endif;

    }

    /**
     * Retrieve a specified resource (viewing|modifying).
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {

        if ($this->userCan('update products')):

            $product = $this->model->with('orders')->with('stocks')->where('user_id', Auth::user()->id)->findOrFail($id);

            return json_encode($product);

        endif;

    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {

        if ($this->userCan('view products')):

            $input = $request->all();

            $products = $this->model->where('user_id', Auth::user()->id);
            
            if (!empty($input['search'])):

                // Full text search does not support AI fields so we'll get a bit creative here to 
                // meet the requirements. We'll use the logic that if keywords are a mix, we will compare
                // against FULL TEXT index, but if it's an integer value then we'll assume the user wants
                // to match a record ID. 
                $matchId = (preg_replace('/[0-9]+/', '', $input['search']) === '');
            
                $products = ($matchId) ? $products->where('id', $input['search']) : $products->search($input['search']);
            
            endif;

            $orderBy = (!empty($input['orderby'])) ? $input['orderby'] : 'product_name';

            $sort = (!empty($input['sort']) && strtolower($input['sort']) === 'desc') ? 'desc' : 'asc';
            
            $products = $products->orderBy($orderBy, $sort)->paginate(10)->onEachSide(0);

            return view('pages.product.index', compact('products'));

        endif;

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {

        if ($this->userCan('add products')):

            $input = $request->all();

            if ($this->validateFromCache($input)):

                // Add current user id from auth
                $input['user_id'] = Auth::user()->id;
                $product = $this->model->create($input);

            endif;

        endif;

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {

        if ($this->userCan('update products')):

            $input = $request->all();

            if ($this->validateFromCache($input)):

                $product = $this->repository->get($id);

                if ($product->count()):

                    // Additional check for ownership or override access
                    if ($this->userHasOverride($product)):
                    
                        $product->fill($input)->save();

                        return MSG::success('Product updated successfully');
                    
                    endif;
                
                else:
    
                    return MSG::danger('Invalid product identifier');
    
                endif;

            endif;

        endif;

    }

}
