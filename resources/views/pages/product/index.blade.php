<?php 

    $output = $content = $items = '';
    $title = __('My Products');

    if (!empty($products)):
        foreach ($products as $product):
            $items .= 
                H::li(
                    H::a(['href' => '#', 'data-bs-show' => 'modal', 'data-id' => $product->id, 'text' => ucwords($product->product_name)])
                )
            ;
        endforeach;
        $content .= H::ul($items, ['id' => 'product-list', 'class' => 'list list-striped list-hover']);
        $content .= H::div(['class' => 'd-flex justify-content-center', 'text' => $products->links()]);
        $content .= H::blade('modals.product');
    else:
        $content .= H::h4(__('No items found'));
    endif;

    $output = H::boutiqueLayout(['title' => $title, 'text' => $content]);

    echo $output;
