<?php 

    $type = 'product';
    $types = INF::pluralize($type);
    $output = $content = $button = $rows = '';
    $title = 'My '.ucfirst($types);

    $button = H::button(['id' => $type.'_show', 'class' => 'btn-md btn-primary float-end', 'data-action' => 'add', 'text' => 'Add '.ucfirst($type)]);

    if (!empty($products)):
        foreach ($products as $product):
            $rows .= 
                H::tr(
                    H::td(H::div(['text' => ucwords($product->product_name)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => ucwords($product->product_type)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => ucwords($product->style)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => ucwords($product->brand)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => '$'.number_format(($product->shipping_price/100), 2)])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'copy', 'data-id' => $product->id, 'text' => __('Copy')])])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'edit', 'data-id' => $product->id, 'text' => __('Edit')])])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'view', 'data-id' => $product->id, 'text' => __('View')])])).
                    ''
                )
            ;
        endforeach;
        $content .= H::form(['id' => $type.'_form_list', 'close' => FALSE]);
            $content .= H::hidden(['id' => 'page', 'value' => request()->input('page')]);
            $content .= H::table(['id' => $type.'_table', 'class' => 'table table-striped table-hover', 'close' => FALSE]);
                $content .= H::thead(
                    H::tr(
                        H::th(H::div(['text' => H::a(['href' => '#', 'data-orderby' => 'product_name', 'text' => __('Name')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'product_type', 'text' => __('Type')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'style', 'text' => __('Style')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'brand', 'text' => __('Brand')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'shipping_price', 'text' => __('Price')])])).
                        H::th(H::div()).
                        H::th(H::div()).
                        H::th(H::div()).
                        ''
                    )
                );
                $content .= H::tbody();
            $content .= H::close('table');
            $content .= H::div(['class' => 'd-flex justify-content-center', 'text' => $products->links()]);
        $content .= H::close('form');
        $content .= H::blade('modals.'.$type);
    else:
        $content .= H::h4('No '.$types.' found');
    endif;

    $output = (COM::isAjaxRequest()) ? $rows : H::boutiqueLayout(['title' => $title, 'button' => $button, 'text' => $content]);

    echo $output;
