<?php


    $class = '';
    $prefix = 'product';
	$template = H::boutiqueDialog($prefix, 'modal-lg');
    $title = T::_('Product Properties');

    $content = 
        H::form(array('id' => $prefix.'_form_write'))->inject(
            H::hidden(array('id' => 'id')).
            H::text(array(
                'id' => $prefix.'_type', 
                'label' => T::_('Product Type'), 
                'validate' => array(
                    'required' => TRUE,
                    'lengthMax' => 100,
                ), 
            )).
            H::text(array(
                'id' => $prefix.'_name', 
                'label' => T::_('Product Name'), 
                'maxlength' => '100',
                'validate' => array(
                    'required' => TRUE,
                    'lengthMax' => 100,
                ), 
            )).
            H::textarea(array(
                'id' => 'description', 
                'label' => T::_('Product Description'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'style', 
                'label' => T::_('Product Style'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'brand', 
                'label' => T::_('Product Brand'), 
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'url', 
                'label' => T::_('Product URL'), 
                'validate' => array(
                    'lengthMax' => 100,
                ), 
            )).
            H::text(array(
                'id' => 'shipping_price', 
                'label' => T::_('Product Shipping Price'), 
                'validate' => array(
                    'integer' => TRUE,
                ), 
            )).
            H::textarea(array(
                'id' => 'note', 
                'label' => T::_('Product Note'), 
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
    