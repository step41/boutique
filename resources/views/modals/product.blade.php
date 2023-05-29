<?php


    $class = '';
    $prefix = 'product';
	$template = H::boutiqueDialog($prefix, 'modal-lg');
    $title = T::_('Product Properties');

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
                    'id' => 'btn_'.$prefix.'_stock', 
                    'prefix' => $prefix, 
                    'action' => 'stock', 
                    'data-navigate' => $prefix.'_stock', 
                    'text' => T::_('Stock')
                )).
                H::btn(array(
                    'id' => 'btn_'.$prefix.'_orders', 
                    'prefix' => $prefix, 
                    'action' => 'orders', 
                    'data-navigate' => $prefix.'_orders', 
                    'text' => T::_('Orders')
                )).
                ''
            ).
            H::div(array('id' => $prefix.'_general', 'class' => 'segment active'))->inject(
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
            ).
            H::div(array('id' => $prefix.'_stock', 'class' => 'segment'))->inject(

            ).
            H::div(array('id' => $prefix.'_orders', 'class' => 'segment'))->inject(

            )
        )
    ;
    
    $buttons = 
        H::btn(array('prefix' => $prefix, 'action' => 'add', 'class' => 'btn-last', 'text' => T::_('Create'))).
        H::btn(array('prefix' => $prefix, 'action' => 'del', 'text' => T::_('Delete'))).
        H::btn(array('prefix' => $prefix, 'action' => 'upd', 'class' => 'btn-last', 'text' => T::_('Update')))
    ;
    
    echo sprintf($template, $class, $prefix, $title, $content, $buttons);
