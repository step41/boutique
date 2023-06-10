<?php 

    $type = 'order';
    $types = INF::pluralize($type);
    $static = $dynamic = $rows = '';
    $title = H::h4(H::a(['href' => route('page.dashboard'), 'text' => H::i(['class' => 'bi-speedometer']).'&nbsp; Dashboard: ']).' &nbsp;My '.ucfirst($types));

    if (!empty($orders) && $orders->count()):
        foreach ($orders as $order):
            $rows .= 
                H::tr(
                    H::td(H::div(['text' => ucwords($order->product_name)])).
                    H::td(H::div(['text' => $order->name])).
                    H::td(H::div(['data-truncate' => '50', 'data-bp' => '1200', 'text' => $order->street_address])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $order->city])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $order->state])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $order->zip])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $order->country_code])).
                    H::td(H::div(['text' => $order->order_status])).
                    H::td(H::div(['text' => date('F d, Y', strtotime($order->created_at))])).
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
                        H::th(H::div(['text' => H::a(['href' => '#', 'data-orderby' => 'product_name', 'text' => __('Product')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'name', 'text' => __('Customer')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => __('Street')])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'city', 'text' => __('City')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'state', 'text' => __('State')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'zip', 'text' => __('Zip')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'country_code', 'text' => __('Country')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'order_status', 'text' => __('Status')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'orders.created_at', 'text' => __('Created')])])).
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
        $dynamic .= H::h4(['class' => 'msg-no-records', 'text' => 'No '.$types.' found']);
    endif;

    // Disabling creation button since it seems more likely that the customers will have their own app for placing an order. But this can easily be re-enabled if required.
    $button = ''; //H::button(['id' => $type.'_show', 'class' => 'btn-md btn-primary float-end', 'data-action' => 'add', 'text' => 'Add '.ucfirst($type)]);
    $static .= 
        H::boutiqueLayout([
            'title' => $title, 
            'button' => $button,
            'text' => H::form(['id' => $type.'_form_list'])->inject(
                H::boutiqueHiddenFields().
                H::boutiqueSearchFields().
                H::div(['data-async' => TRUE])
                // table content will be dynamically loaded here...
            ),
            'modal' => H::blade('modals.'.$type, get_defined_vars())
        ])
    ;

    $output = (COM::isAjaxRequest()) ? $dynamic : $static;

    echo $output;

/*

					'name',
					'street_address',
					'city',
					'state',
					'zip',
					'country_code',
					'order_status',
					'created_at',

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