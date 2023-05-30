<?php 

    $type = 'product';
    $types = INF::pluralize($type);
    $static = $dynamic = $rows = '';
    $title = H::h4(H::a(['href' => route('dashboard'), 'text' => H::i(['class' => 'bi-speedometer']).'&nbsp; Dashboard: ']).' &nbsp;My '.ucfirst($types));

    if (!empty($products)):
        foreach ($products as $product):
            $rows .= 
                H::tr(
                    H::td(H::div(['data-bp' => '1200', 'text' => $product->id])).
                    H::td(H::div(['text' => ucwords($product->product_name)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => ucwords($product->product_type)])).
                    H::td(H::div(['data-bp' => '1440', 'text' => ucwords($product->style)])).
                    H::td(H::div(['data-bp' => '1440', 'text' => ucwords($product->brand)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => '$'.number_format(($product->shipping_price/100), 2)])).
                    H::td(H::div(['data-bp' => '992', 'text' => date('m/d/Y', strtotime($product->created_at))])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'copy', 'data-id' => $product->id, 'text' => __('Copy')])])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'edit', 'data-id' => $product->id, 'text' => __('Edit')])])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'view', 'data-id' => $product->id, 'text' => __('View')])])).
                    ''
                )
            ;
        endforeach;
        $dynamic .= 
            H::table(['id' => $type.'_table', 'class' => 'table table-striped table-hover'])->inject(
                H::thead(
                    H::tr(
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'id', 'text' => __('ID')])])).
                        H::th(H::div(['text' => H::a(['href' => '#', 'data-orderby' => 'product_name', 'text' => __('Name')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'product_type', 'text' => __('Type')])])).
                        H::th(H::div(['data-bp' => '1440', 'text' => H::a(['href' => '#', 'data-orderby' => 'style', 'text' => __('Style')])])).
                        H::th(H::div(['data-bp' => '1440', 'text' => H::a(['href' => '#', 'data-orderby' => 'brand', 'text' => __('Brand')])])).
                        H::th(H::div(['data-bp' => '1440', 'text' => H::a(['href' => '#', 'data-orderby' => 'shipping_price', 'text' => __('Price')])])).
                        H::th(H::div(['data-bp' => '992', 'text' => H::a(['href' => '#', 'data-orderby' => 'created_at', 'text' => __('Created')])])).
                        H::th(H::div()).
                        H::th(H::div()).
                        H::th(H::div()).
                        ''
                    ).
                    ''
                ).
                H::tbody($rows)
            ).
            H::div(['class' => 'd-flex justify-content-center', 'text' => $products->links()])
        ;
    else:
        $dynamic .= H::h4('No '.$types.' found');
    endif;

    $button = H::button(['id' => $type.'_show', 'class' => 'btn-md btn-primary float-end', 'data-action' => 'add', 'text' => 'Add '.ucfirst($type)]);
    $static .= 
        H::boutiqueLayout([
            'title' => $title, 
            'button' => $button,
            'text' => H::form(['id' => $type.'_form_list'])->inject(
                H::boutiqueHiddenFields().
                H::boutiqueSearchFields().
                H::div(['data-async' => TRUE])
                // table content will be dynamically loaded here...
            ).
            H::blade('modals.'.$type)
        ])
    ;

    $output = (COM::isAjaxRequest()) ? $dynamic : $static;

    echo $output;
