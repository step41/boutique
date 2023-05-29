<?php


    $class = '';
    $prefix = 'stock';
	$template = H::boutiqueDialog($prefix, 'modal-lg');
    $title = T::_('Stock Properties');

    $content = 
        H::form(array('id' => $prefix.'_form_write'))->inject(
            H::hidden(array('id' => 'id')).
            H::text(array(
                'id' => $prefix.'_type', 
                'label' => T::_('Stock Type'), 
                'validate' => array(
                    'required' => TRUE,
                    'lengthMax' => 100,
                ), 
            )).
            H::text(array(
                'id' => $prefix.'_name', 
                'label' => T::_('Stock Name'), 
                'maxlength' => '100',
                'validate' => array(
                    'required' => TRUE,
                    'lengthMax' => 100,
                ), 
            )).
            H::textarea(array(
                'id' => 'description', 
                'label' => T::_('Stock Description'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'style', 
                'label' => T::_('Stock Style'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'brand', 
                'label' => T::_('Stock Brand'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'url', 
                'label' => T::_('Stock URL'), 
                'validate' => array(
                    'lengthMax' => 100,
                ), 
            )).
            H::text(array(
                'id' => 'shipping_price', 
                'label' => T::_('Stock Shipping Price'), 
                'validate' => array(
                    'integer' => TRUE,
                ), 
            )).
            H::textarea(array(
                'id' => 'note', 
                'label' => T::_('Stock Note'), 
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