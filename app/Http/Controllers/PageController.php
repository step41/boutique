<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Stock;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Repositories\StockRepository;
use App\Facades\Message as MSG;
use Illuminate\Http\Request;
use App\Traits\RolePermissions;
use App\Traits\ValidateFromCache;
use Auth;
use Session;
use Log;

/**
 * Page Controller
 * 
 * This controller will serve as a generic page dispenser for those areas of the site
 * that are not specific to database table (records) interaction. A more scaleable 
 * solution can be developed at a later time if required.
 *
 * @package		Controllers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class PageController extends Controller {

    use RolePermissions, ValidateFromCache;
    
    /**
     * Create a new controller instance.
     *
     * @param Order $orderModel
     * @param OrderRepository $orderRepository
     * @param Product $productModel
     * @param ProductRepository $productRepository
     * @param Stock $stockModel
     * @param StockRepository $stockRepository
     */
    public function __construct(
        Order               $orderModel, 
        OrderRepository     $orderRepository,
        Product             $productModel, 
        ProductRepository   $productRepository,
        Stock               $stockModel, 
        StockRepository     $stockRepository,
    ) {

        $this->middleware('auth');
        $this->orderModel           = $orderModel; 
        $this->orderRepository      = $orderRepository;
        $this->productModel         = $productModel;
        $this->productRepository    = $productRepository;
        $this->stockModel           = $stockModel;
        $this->stockRepository      = $stockRepository;
    
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function dashboard()
    {
        return view('pages.dashboard');
    }

    /**
     * Overview of data and statistical detals
     *
     * @return \Illuminate\Http\Response
     */
    public function overview() {

        if ($this->userCan('view products') && $this->userCan('view orders') && $this->userCan('view stocks')):

            // Show a total of sales for all orders
            $sum = $this->orderRepository->getTotalSalesForAllOrdersByUser();

            //Show the average sale total across all orders
            $avg = $this->orderRepository->getAverageSalesForAllOrdersByUser();

            $statistics = ['statistics' => ['sum' => $sum, 'avg' => $avg]];

            return view('pages.overview', $statistics);

        endif;

    }

}
