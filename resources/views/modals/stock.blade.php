<?php


    $class = '';
    $prefix = 'stock';
	$template = H::boutiqueDialog($prefix, 'modal-lg');
    $title = T::_('Stock Properties');

    $content = 
        H::form(array('id' => $prefix.'_form_write'))->inject(
            H::hidden(array('id' => 'id')).
            H::text(array(
                'id' => 'quantity', 
                'label' => T::_('Quantity'), 
            )).
            H::text(array(
                'id' => 'color', 
                'label' => T::_('Color'), 
            )).
            H::textarea(array(
                'id' => 'size', 
                'label' => T::_('Size'), 
            )).
            H::text(array(
                'id' => 'weight', 
                'label' => T::_('Weight'), 
            )).
            H::text(array(
                'id' => 'length', 
                'label' => T::_('Length'), 
            )).
            H::text(array(
                'id' => 'width', 
                'label' => T::_('Width'), 
            )).
            H::text(array(
                'id' => 'height', 
                'label' => T::_('Height'), 
            )).
            H::text(array(
                'id' => 'cost_cents', 
                'label' => T::_('Cost (cents)'), 
            )).
            H::text(array(
                'id' => 'price_cents', 
                'label' => T::_('Price (cents)'), 
            )).
            H::text(array(
                'id' => 'sale_price_cents', 
                'label' => T::_('Sale Price (cents)'), 
            )).
            H::text(array(
                'id' => 'sku', 
                'label' => T::_('SKU'), 
            )).
            H::textarea(array(
                'id' => 'note', 
                'label' => T::_('Stock Note'), 
            )).
            ''
        )
    ;
    
    $buttons = 
        //H::btn(array('prefix' => $prefix, 'action' => 'add', 'class' => 'btn-last', 'text' => T::_('Create'))).
        //H::btn(array('prefix' => $prefix, 'action' => 'del', 'text' => T::_('Delete'))).
       // H::btn(array('prefix' => $prefix, 'action' => 'upd', 'class' => 'btn-last', 'text' => T::_('Update'))).
       ''
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