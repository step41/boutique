<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Repositories\StockRepository;
use App\Facades\Message as MSG;
use Illuminate\Http\Request;
use App\Traits\RolePermissions;
use App\Traits\ValidateFromCache;
use Auth;
use Session;

/**
 * Stock Controller
 *
 * @package		Controllers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class StockController extends Controller {

    use RolePermissions, ValidateFromCache;

    protected $_overrideRoles = ['administrator', 'superadmin'];
    
    /**
     * Create a new controller instance.
     *
     * @param Stock $model
     * @param StockRepository $repository
     */
    public function __construct(Stock $model, StockRepository $repository) {

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

        if ($this->userCan('delete stocks')):

            $stock = $this->repository->get($id);

            if ($stock->count()):

                // Additional check for ownership or override access
                if ($this->userHasOverride($stock)):
                
                    $stock->delete();

                    return MSG::success('Stock deleted successfully');

                endif;
            
            else:

                return MSG::danger('Invalid stock identifier');

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

        if ($this->userCan('update stocks')):

            $stock = $this->repository->get($id);

            return json_encode($stock);

        endif;

    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {

        if ($this->userCan('view stocks')):

            $input = $request->all();

            $stocks = $this->repository->getWithProductByUser();
            $stocks = $this->model->where('user_id', Auth::user()->id);
            
            if (!empty($input['search'])):

                $searchKey = (!empty($input['searchkey'])) ? $input['searchkey'] : 'sku';
            
                $stocks = $stocks->search($input['search']);
            
            endif;

            $orderBy = (!empty($input['orderby'])) ? $input['orderby'] : 'product_name';

            $sort = (!empty($input['sort']) && strtolower($input['sort']) === 'desc') ? 'desc' : 'asc';
            
            $stocks = $stocks->orderBy($orderBy, $sort)->paginate(10)->onEachSide(0);

            return view('pages.stock.index', compact('stocks'));

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

        if ($this->userCan('add stocks')):

            $input = $request->all();

            if ($this->validateFromCache($input)):

                // Add current user id from auth
                $input['user_id'] = Auth::user()->id;
                $stock = $this->model->create($input);

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

        if ($this->userCan('update stocks')):

            $input = $request->all();

            if ($this->validateFromCache($input)):

                $stock = $this->repository->get($id);

                if ($stock->count()):

                    // Additional check for ownership or override access
                    if ($this->userHasOverride($stock)):
                    
                        $stock->fill($input)->save();

                        return MSG::success('Stock updated successfully');
                    
                    endif;
                
                else:
    
                    return MSG::danger('Invalid stock identifier');
    
                endif;

            endif;

        endif;

    }

}
