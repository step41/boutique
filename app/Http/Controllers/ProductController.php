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

    protected $_overrideRoles = ['administrator', 'superadmin'];
    
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
                $owner = $product->user_id === Auth::user()->id;

                if ($owner || $this->userHasAny($this->_overrideRoles)):
                
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

            $product = $this->repository->get($id);

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

            $products = $this->model->with('orders')->with('stock')->where('user_id', Auth::user()->id);
            
            if (!empty($input['search'])):

                $searchKey = (!empty($input['searchkey'])) ? $input['searchkey'] : 'product_name';
            
                $products = $products->whereLike($searchKey, $input['search']);
            
            endif;
            
            $products = $products->orderBy('product_name')->paginate(10)->onEachSide(0);

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
                    $owner = $product->user_id === Auth::user()->id;
    
                    if ($owner || $this->userHasAny($this->_overrideRoles)):
                    
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
