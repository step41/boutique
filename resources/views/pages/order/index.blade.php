<?php 

    $type = 'order';
    $types = INF::pluralize($type);
    $static = $dynamic = $rows = '';
    $title = 'My '.ucfirst($types);

    if (!empty($orders)):
        foreach ($orders as $order):
            $rows .= 
                H::tr(
                    H::td(H::div(['text' => ucwords($order->order_name)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => ucwords($order->order_type)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => ucwords($order->style)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => ucwords($order->brand)])).
                    H::td(H::div(['data-bp' => '1200', 'text' => '$'.number_format(($order->shipping_price/100), 2)])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'copy', 'data-id' => $order->id, 'text' => __('Copy')])])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'edit', 'data-id' => $order->id, 'text' => __('Edit')])])).
                    H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'view', 'data-id' => $order->id, 'text' => __('View')])])).
                    ''
                )
            ;
        endforeach;
        $dynamic .= 
            H::table(['id' => $type.'_table', 'class' => 'table table-striped table-hover'])->inject(
                H::thead(
                    H::tr(
                        H::th(H::div(['text' => H::a(['href' => '#', 'data-orderby' => 'order_name', 'text' => __('Name')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'order_type', 'text' => __('Type')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'style', 'text' => __('Style')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'brand', 'text' => __('Brand')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'shipping_price', 'text' => __('Price')])])).
                        H::th(H::div()).
                        H::th(H::div()).
                        H::th(H::div()).
                        ''
                    ).
                    ''
                ).
                H::tbody($rows)
            ).
            H::div(['class' => 'd-flex justify-content-center', 'text' => $orders->links()])
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

/*
    'product_id',
    'stock_id',
    'street_address',
    'apartment',
    'city',
    'state',
    'country_code',
    'zip',
    'phone_number',
    'email',
    'name',
    'order_status',
    'payment_ref',
    'transaction_id',
    'payment_amt_cents',
    'ship_charged_cents',
    'ship_cost_cents',
    'subtotal_cents',
    'total_cents',
    'shipper_name',
    'payment_date',
    'shipped_date',
    'tracking_number',
    'tax_total_cents',
*/    