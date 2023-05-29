<?php


    $class = '';
    $prefix = 'order';
	$template = H::boutiqueDialog($prefix, 'modal-lg');
    $title = T::_('Order Properties');

    $content = 
        H::form(array('id' => $prefix.'_form_write'))->inject(
            H::hidden(array('id' => 'id')).
            H::text(array(
                'id' => $prefix.'_type', 
                'label' => T::_('Order Type'), 
                'validate' => array(
                    'required' => TRUE,
                    'lengthMax' => 100,
                ), 
            )).
            H::text(array(
                'id' => $prefix.'_name', 
                'label' => T::_('Order Name'), 
                'maxlength' => '100',
                'validate' => array(
                    'required' => TRUE,
                    'lengthMax' => 100,
                ), 
            )).
            H::textarea(array(
                'id' => 'description', 
                'label' => T::_('Order Description'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'style', 
                'label' => T::_('Order Style'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'brand', 
                'label' => T::_('Order Brand'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'url', 
                'label' => T::_('Order URL'), 
                'validate' => array(
                    'lengthMax' => 100,
                ), 
            )).
            H::text(array(
                'id' => 'shipping_price', 
                'label' => T::_('Order Shipping Price'), 
                'validate' => array(
                    'integer' => TRUE,
                ), 
            )).
            H::textarea(array(
                'id' => 'note', 
                'label' => T::_('Order Note'), 
            )).
            ''
        )
    ;
    
    $buttons = 
        H::btn(array('prefix' => $prefix, 'action' => 'add', 'class' => 'btn-last', 'text' => T::_('Create'))).
        H::btn(array('prefix' => $prefix, 'action' => 'del', 'text' => T::_('Delete'))).
        H::btn(array('prefix' => $prefix, 'action' => 'upd', 'class' => 'btn-last', 'text' => T::_('Update')))
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