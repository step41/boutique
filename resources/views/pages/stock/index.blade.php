<?php 

    $type = 'stock';
    $types = INF::pluralize($type);
    $static = $dynamic = $rows = '';
    $title = H::h4(H::a(['href' => route('dashboard'), 'text' => H::i(['class' => 'bi-speedometer']).'&nbsp; Dashboard: ']).' &nbsp;My '.ucfirst($types));

    if (!empty($stocks)):
        foreach ($stocks as $stock):
            $rows .= 
                H::tr(
                    H::td(H::div(['text' => ucwords($stock->product_name)])).
                    H::td(H::div(['data-bp' => '992', 'text' => $stock->sku])).
                    H::td(H::div(['data-bp' => '992', 'text' => $stock->quantity])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $stock->color])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $stock->size])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $stock->weight])).
                    H::td(H::div(['data-bp' => '1440', 'text' => $stock->length])).
                    H::td(H::div(['data-bp' => '1440', 'text' => $stock->width])).
                    H::td(H::div(['data-bp' => '1440', 'text' => $stock->height])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'edit', 'data-id' => $stock->id, 'text' => __('Edit')])])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'view', 'data-id' => $stock->id, 'text' => __('View')])])).
                    ''
                )
            ;
        endforeach;
        $dynamic .= 
            H::table(['id' => $type.'_table', 'class' => 'table table-striped table-hover'])->inject(
                H::thead(
                    H::tr(
                        H::th(H::div(['text' => H::a(['href' => '#', 'data-orderby' => 'product_name', 'text' => __('Product')])])).
                        H::th(H::div(['data-bp' => '992', 'text' => H::a(['href' => '#', 'data-orderby' => 'sku', 'text' => __('SKU')])])).
                        H::th(H::div(['data-bp' => '992', 'text' => H::a(['href' => '#', 'data-orderby' => 'quantity', 'text' => __('Quantity')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'color', 'text' => __('Color')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'size', 'text' => __('Size')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'weight', 'text' => __('Weight')])])).
                        H::th(H::div(['data-bp' => '1440', 'text' => H::a(['href' => '#', 'data-orderby' => 'length', 'text' => __('Length')])])).
                        H::th(H::div(['data-bp' => '1440', 'text' => H::a(['href' => '#', 'data-orderby' => 'width', 'text' => __('Width')])])).
                        H::th(H::div(['data-bp' => '1440', 'text' => H::a(['href' => '#', 'data-orderby' => 'height', 'text' => __('Height')])])).
                        H::th(H::div()).
                        H::th(H::div()).
                        ''
                    ).
                    ''
                ).
                H::tbody($rows)
            ).
            H::div(['class' => 'd-flex justify-content-center', 'text' => $stocks->links()])
        ;
    else:
        $dynamic .= H::h4('No '.$types.' found');
    endif;

    // Not sure how stock is currently handled so I'm disabling the creation button for now. But this can easily be re-enabled if required.
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

/*
    'product_id',
    'quantity',
    'color',
    'size',
    'weight',
    'price_cents',
    'sale_price_cents',
    'cost_cents',
    'sku',
    'length',
    'width',
    'height',
    'note',
*/