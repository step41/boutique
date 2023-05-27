<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Http\Request;
use Auth;
use Session;

/**
 * Product Controller
 *
 * @package		Controllers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class ProductController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @param Product $model
     * @param ProductRepository $repository
     */
    public function __construct(Product $model, ProductRepository $repository)
    {
        $this->model = $model;
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('view products')):
            abort('401', '401');
        endif;

        $input = $request->all();
        $products = $this->model;
        if (!empty($input['search'])):
            $products = $products->whereLike('product_name', $input['search']);
        endif;
        $products = $products->paginate(10);

        return view('pages.product.index', compact('products'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (!Auth::user()->hasPermissionTo('Create Product')) {
            abort('401', '401');
        }

        $categories = $this->category_repository->getAllParentCategories();
        $materials = $this->material_repository->getAllActiveMaterials();
        $option_types = $this->option_type_repository->getOptionTypes();
        $quote_option_types = $this->quote_option_type_repository->getQuoteOptionTypes();
        $documents = $this->document_repository->getAll();
        $images = $this->image_repository->getAll();
        $batches = $this->batch_repository->getBatches();

        return view('admin.pages.product.create', compact('categories', 'materials', 'option_types', 'documents', 'images', 'quote_option_types', 'batches'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('Create Product')) {
            abort('401', '401');
        }

        $this->validate($request, [
            'code' => 'required|max:25|unique:products,code,NULL,id,deleted_at,NULL',
            'name' => 'required|max:75',
            'short_name' => 'required|max:16',
            'slug' => 'required|max:75|unique:products,slug,NULL,id,deleted_at,NULL',
            'categories' => 'required',
        ]);

        $input = $request->all();
        $input['is_indexed'] = isset($input['is_indexed']) ? 1 : 0;
        $input['is_active'] = isset($input['is_active']) ? 1 : 0;
        $input['designer_use_static_templates'] = !empty($input['designer_use_static_templates']) ? 1 : 0;
        $input['banner_description'] = (!empty($input['banner_description'])) ? trim(stripslashes($input['banner_description'])) : '';
        $input['short_description'] = (!empty($input['short_description'])) ? trim(stripslashes($input['short_description'])) : '';
        $input['content'] = (!empty($input['content'])) ? trim(stripslashes($input['content'])) : '';
        $input['summary'] = (!empty($input['summary'])) ? trim(strip_tags(stripslashes($input['summary']))) : '';

        /* seo meta */
        $input['seo_meta_id'] = isset($input['seo_meta_id']) ? $input['seo_meta_id'] : 0;
        $seo_inputs = $request->only(['meta_title', 'meta_keywords', 'meta_description', 'seo_meta_id']);
        $seo_meta = $this->seo_meta_repository->updateOrCreate($seo_inputs);
        $input['seo_meta_id'] = $seo_meta->id;
        /* seo meta */

        $product = $this->model->create($input);

        /* categories */
        if (isset($input['categories']) && !in_array(null, $input['categories'])) {
            $product->categories()->sync($input['categories']);
        } else {
            $product->categories()->detach();
        }
        /* categories */

        /* option types */
        if (isset($input['option_types']) && !in_array(null, $input['Option_types']) ) {
            $option_type_pivot = [];
            foreach ($input['option_types'] as $option_type) {
                $option_type_pivot[$option_type] = ['input_type' => $input['input_type'][$option_type]];
            }

            $product->option_types()->sync($option_type_pivot);
        } else {
            $product->option_types()->detach();
        }
        /* option types */

        /* options */
        if (isset($input['options']) && !in_array(null, $input['options'])) {
            $product->options()->sync($input['options']);
        } else {
            $product->options()->detach();
        }
        /* options */

        /* quote_option types */
        if (isset($input['quote_option_types']) && !in_array(null, $input['quote_option_types'])) {
            $quote_option_type_pivot = [];
            foreach ($input['quote_option_types'] as $quote_option_type) {
                $quote_option_type_pivot[$quote_option_type] = ['input_type' => $input['input_type'][$quote_option_type]];
            }

            $product->quote_option_types()->sync($quote_option_type_pivot);
        } else {
            $product->quote_option_types()->detach();
        }
        /* quote_option types */

        /* quote_options */
        if (isset($input['quote_options']) && !in_array(null, $input['quote_options'])) {
            $product->quote_options()->sync($input['quote_options']);
        } else {
            $product->quote_options()->detach();
        }
        /* quote_options */

        /* documents */
        if (isset($input['documents']) && !in_array(null, $input['documents'])) {
            $product->documents()->sync($input['documents']);
        } else {
            $product->documents()->detach();
        }
        /* documents */

        /* images */
        if (!empty($input['images'])):
            if (!empty($input['image_order'])):
                foreach($input['image_order'] as $imageCount => $imageId): 
                    $input['images'][$imageId] = ['order' => $imageCount];
                endforeach;
            endif; 
            $product->images()->sync($input['images']);
        else: 
            $product->images()->detach();
        endif;
        /* images */

//        /* images */
//        if (isset($input['images'])) {
//            $this->repository->uploadImage($request, $product);
//        }
//        /* images */

        /* batches */
        if (isset($input['batches']) && !in_array(null, $input['batches'])) {
            $product->batches()->sync($input['batches']);
        } else {
            $product->batches()->detach();
        }
        /* batches */

        return redirect()->route('admin.products.index')
            ->with('flash_message', [
                'title' => '',
                'message' => 'Product ' . $product->name . ' successfully added.',
                'type' => 'success'
            ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (!Auth::user()->hasPermissionTo('Read Product')) {
            abort('401', '401');
        }

        return redirect('admin/products');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (!Auth::user()->hasPermissionTo('Update Product')) {
            abort('401', '401');
        }

        $product = $this->model->findOrFail($id);
        $categories = $this->category_repository->getAllParentCategories();
        $materials = $this->material_repository->getAllActiveMaterials();
        $option_types = $this->option_type_repository->getOptionTypes();
        $quote_option_types = $this->quote_option_type_repository->getQuoteOptionTypes();
        $documents = $this->document_repository->getAll();
        $seo_meta_fields = $product->seo_meta;
        $images = $this->image_repository->getAllProduct();
        $batches = $this->batch_repository->getBatches();

        return view('admin.pages.product.edit', compact('product', 'categories', 'materials', 'option_types', 'documents', 'seo_meta_fields', 'images', 'quote_option_types', 'batches'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (!Auth::user()->hasPermissionTo('Update Product')) {
            abort('401', '401');
        }

        $this->validate($request, [
            'code' => 'required|max:25|unique:products,code,' . $id .',id,deleted_at,NULL',
            'name' => 'required|max:75',
            'short_name' => 'required|max:16',
            'slug' => 'required|max:75|unique:products,slug,' . $id .',id,deleted_at,NULL',
            'categories' => 'required',
        ]);

        $product = $this->model->findOrFail($id);
        $input = $request->all();
        $input['is_indexed'] = isset($input['is_indexed']) ? 1 : 0;
        $input['is_active'] = isset($input['is_active']) ? 1 : 0;
        $input['designer_use_static_templates'] = !empty($input['designer_use_static_templates']) ? 1 : 0;
        $input['banner_description'] = (!empty($input['banner_description'])) ? trim(stripslashes($input['banner_description'])) : '';
        $input['short_description'] = (!empty($input['short_description'])) ? trim(stripslashes($input['short_description'])) : '';
        $input['content'] = (!empty($input['content'])) ? trim(stripslashes($input['content'])) : '';
        $input['summary'] = (!empty($input['summary'])) ? trim(strip_tags(stripslashes($input['summary']))) : '';

        /* seo meta */
        $input['seo_meta_id'] = isset($input['seo_meta_id']) ? $input['seo_meta_id'] : 0;
        $seo_inputs = $request->only(['meta_title', 'meta_keywords', 'meta_description', 'seo_meta_id']);
        $seo_meta = $this->seo_meta_repository->updateOrCreate($seo_inputs);
        $input['seo_meta_id'] = $seo_meta->id;
        /* seo meta */

        $product->fill($input)->save();

        /* categories */
        if (isset($input['categories'])) {
            $product->categories()->sync($input['categories']);
        } else {
            $product->categories()->detach();
        }
        /* categories */

        /* option types */
        if (isset($input['option_types'])) {
            $option_type_pivot = [];
            foreach ($input['option_types'] as $option_type) {
                $option_type_pivot[$option_type] = ['input_type' => /*$input['input_type'][$option_type]*/0];
            }

            $product->option_types()->sync($option_type_pivot);
        } else {
            $product->option_types()->detach();
        }
        /* option types */

        /* options */
        if (isset($input['options'])) {
            $product->options()->sync($input['options']);
        } else {
            $product->options()->detach();
        }
        /* options */

        /* quote_option types */
        if (isset($input['quote_option_types'])) {
            $quote_option_type_pivot = [];
            foreach ($input['quote_option_types'] as $quote_option_type) {
                $quote_option_type_pivot[$quote_option_type] = ['input_type' => $input['input_type'][$quote_option_type]];
            }

            $product->quote_option_types()->sync($quote_option_type_pivot);
        } else {
            $product->quote_option_types()->detach();
        }
        /* quote_option types */

        /* quote_options */
        if (isset($input['quote_options'])) {
            $product->quote_options()->sync($input['quote_options']);
        } else {
            $product->quote_options()->detach();
        }
        /* quote_options */

        /* documents */
        if (isset($input['documents'])) {
            $product->documents()->sync($input['documents']);
        } else {
            $product->documents()->detach();
        }
        /* documents */

        /* images */
        if (!empty($input['images'])):
            if (!empty($input['image_order'])):
                foreach($input['image_order'] as $imageCount => $imageId): 
                    $input['images'][$imageId] = ['order' => $imageCount];
                endforeach;
            endif;
            $product->images()->sync($input['images']);
        else: 
            $product->images()->detach();
        endif;
        /* images */

//        /* existing images */
//        if (isset($input['existing_images'])) {
//            $existing_images = [];
//            foreach ($product->images as $image) {
//                $existing_images[] = $image->id;
//                $is_featured = 0;
//                if (array_key_exists($image->id, $input['existing_image_checkboxes'])) {
//                    $is_featured = 1;
//                }
//                $image->fill(['is_featured' => $is_featured])->save();
//            }
//
//            $existing_images_diff = array_diff($existing_images, $input['existing_images']);
//            if (count($existing_images_diff) > 0) {
//                $product->images()->whereIn('id', $existing_images_diff)->delete();
//            }
//        } else {
//            $product->images()->delete();
//        }
//        /* existing images */
//
//        /* new images */
//        if (isset($input['images'])) {
//            $this->repository->uploadImage($request, $product);
//        }
//        /* new images */

        /* batches */
        // I am not sure if batches are being used, but if it has a 'null' value in the batches array, we are going to
        // skip it and detach it from the pivot table (product_batches_matrix).
        if (isset($input['batches']) && !in_array(null, $input['batches'])) {
            $product->batches()->sync($input['batches']);
        } else {
            $product->batches()->detach();
        }
        /* batches */

        return redirect()->route('admin.products.edit', $id)
            ->with('flash_message', [
                'title' => '',
                'message' => 'Product ' . $product->name . ' successfully updated.',
                'type' => 'success'
            ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!Auth::user()->hasPermissionTo('Delete Product')) {
            abort('401', '401');
        }

        $product = $this->model->findOrFail($id);
        $product->delete();

        $response = array(
            'status' => FALSE,
            'data' => array(),
            'message' => array(),
        );

        $response['message'][] = 'Product successfully deleted.';
        $response['data']['id'] = $id;
        $response['status'] = TRUE;

        return json_encode($response);
    }
}
