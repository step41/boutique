<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Facades\Message as MSG;
use Illuminate\Http\Request;
use App\Traits\RolePermissions;
use App\Traits\ValidateFromCache;
use Auth;
use Session;

/**
 * Order Controller
 *
 * @package		Controllers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class OrderController extends Controller {

    use RolePermissions, ValidateFromCache;
    
    /**
     * Create a new controller instance.
     *
     * @param Order $model
     * @param OrderRepository $repository
     */
    public function __construct(Order $model, OrderRepository $repository) {

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

        if ($this->userCan('delete orders')):

            $order = $this->repository->get($id);

            if ($order->count()):

                // Additional check for ownership or override access
                if ($this->userHasOverride($order)):
                
                    $order->delete();

                    return MSG::success('Order deleted successfully');

                endif;
            
            else:

                return MSG::danger('Invalid order identifier');

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

        if ($this->userCan('update orders')):

            $order = $this->repository->get($id);

            return json_encode($order);

        endif;

    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {

        if ($this->userCan('view orders')):

            $input = $request->all();

            $orders = $this->repository->getWithProductsAndStocksByUser();
            
            if (!empty($input['search'])):

                // Full text search does not support AI fields so we'll get a bit creative here to 
                // meet the requirements. We'll use the logic that if keywords are a mix, we will compare
                // against FULL TEXT index, but if it's an integer value then we'll assume the user wants
                // to match a record ID. 
                $matchId = (preg_replace('/[0-9]+/', '', $input['search']) === '');
            
                $orders = ($matchId) ? $orders->where('id', $input['search']) : $orders->search($input['search']);
            
            endif;

            $orderBy = (!empty($input['orderby'])) ? $input['orderby'] : 'product_name';

            $sort = (!empty($input['sort']) && strtolower($input['sort']) === 'desc') ? 'desc' : 'asc';
            
            $orders = $orders->orderBy($orderBy, $sort);
            
            $orders = $orders->paginate(10)->onEachSide(0);

            return view('pages.order.index', compact('orders'));

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

        if ($this->userCan('add orders')):

            $input = $request->all();

            if ($this->validateFromCache($input)):

                // Add current user id from auth
                $input['user_id'] = Auth::user()->id;
                $order = $this->model->create($input);

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

        if ($this->userCan('update orders')):

            $input = $request->all();

            if ($this->validateFromCache($input)):

                $order = $this->repository->get($id);

                if ($order->count()):

                    // Additional check for ownership or override access
                    if ($this->userHasOverride($order)):
                    
                        $order->fill($input)->save();

                        return MSG::success('Order updated successfully');
                    
                    endif;
                
                else:
    
                    return MSG::danger('Invalid order identifier');
    
                endif;

            endif;

        endif;

    }

}
