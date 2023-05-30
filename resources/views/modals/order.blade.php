<?php


    $class = '';
    $prefix = 'order';
	$template = H::boutiqueDialog($prefix, 'modal-lg');
    $title = T::_('Order Properties');

    $content = 
        H::form(array('id' => $prefix.'_form_write'))->inject(
            H::div(array('class' => 'btn-group segmented-control'))->inject(
                H::btn(array(
                    'id' => 'btn_'.$prefix.'_general', 
                    'prefix' => $prefix, 
                    'action' => 'general', 
                    'class' => 'active', 
                    'data-navigate' => $prefix.'_general', 
                    'text' => T::_('General')
                )).
                H::btn(array(
                    'id' => 'btn_'.$prefix.'_details', 
                    'prefix' => $prefix, 
                    'action' => 'details', 
                    'data-navigate' => $prefix.'_details', 
                    'text' => T::_('Details')
                )).
                ''
            ).
            H::div(array('id' => $prefix.'_general', 'class' => 'segment active'))->inject(
                H::hidden(array('id' => 'id')).
                H::text(array(
                    'id' => 'name', 
                    'label' => T::_('Customer Name'), 
                )).
                H::text(array(
                    'id' => 'email', 
                    'label' => T::_('E-mail'), 
                )).
                H::text(array(
                    'id' => 'phone_number', 
                    'label' => T::_('Phone Number'), 
                )).
                H::textarea(array(
                    'id' => 'street_address', 
                    'label' => T::_('Street Address'), 
                )).
                H::text(array(
                    'id' => 'apartment', 
                    'label' => T::_('Apartment #'), 
                )).
                H::text(array(
                    'id' => 'city', 
                    'label' => T::_('City'), 
                )).
                H::text(array(
                    'id' => 'state', 
                    'label' => T::_('State'), 
                )).
                H::text(array(
                    'id' => 'country_code', 
                    'label' => T::_('Country'), 
                )).
                H::text(array(
                    'id' => 'zip', 
                    'label' => T::_('Zip'), 
                )).
                H::text(array(
                    'id' => 'order_status', 
                    'label' => T::_('Status'), 
                )).
                ''
            ).
            H::div(array('id' => $prefix.'_details', 'class' => 'segment'))->inject(
                H::text(array(
                    'id' => 'transaction_id', 
                    'label' => T::_('Transaction Id'), 
                )).
                H::text(array(
                    'id' => 'payment_ref', 
                    'label' => T::_('Payment Ref'), 
                )).
                H::text(array(
                    'id' => 'payment_date', 
                    'label' => T::_('Payment Date'), 
                )).
                H::text(array(
                    'id' => 'shipper_name', 
                    'label' => T::_('Shipper Name'), 
                )).
                H::text(array(
                    'id' => 'shipped_date', 
                    'label' => T::_('Shipped Date'), 
                )).
                H::text(array(
                    'id' => 'tracking_number', 
                    'label' => T::_('Tracking Number'), 
                )).
                H::text(array(
                    'id' => 'payment_amt_cents', 
                    'label' => T::_('Payment (cents)'), 
                )).
                H::text(array(
                    'id' => 'ship_charged_cents', 
                    'label' => T::_('Shipping Charge (cents)'), 
                )).
                H::text(array(
                    'id' => 'ship_cost_cents', 
                    'label' => T::_('Shipping Cost (cents)'), 
                )).
                H::text(array(
                    'id' => 'subtotal_cents', 
                    'label' => T::_('Subtotal (cents)'), 
                )).
                H::text(array(
                    'id' => 'tax_total_cents', 
                    'label' => T::_('Total Tax (cents)'), 
                )).
                H::text(array(
                    'id' => 'total_cents', 
                    'label' => T::_('Total (cents)'), 
                )).
                ''
            )
        )
    ;
    
    $buttons = 
        H::btn(array('prefix' => $prefix, 'action' => 'add', 'class' => 'btn-last', 'text' => T::_('Create'))).
        H::btn(array('prefix' => $prefix, 'action' => 'del', 'text' => T::_('Delete'))).
        H::btn(array('prefix' => $prefix, 'action' => 'upd', 'class' => 'btn-last', 'text' => T::_('Update'))).
        ''
    ;
    
    echo sprintf($template, $class, $prefix, $title, $content, $buttons);
    
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