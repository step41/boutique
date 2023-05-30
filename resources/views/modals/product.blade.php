<?php


    $class = '';
    $prefix = 'product';
	$template = H::boutiqueDialog($prefix, 'modal-xl');
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
                    'id' => 'btn_'.$prefix.'_stocks', 
                    'prefix' => $prefix, 
                    'action' => 'stocks', 
                    'data-navigate' => $prefix.'_stocks', 
                    'text' => T::_('Stocks')
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
            H::div(array('id' => $prefix.'_stocks', 'class' => 'segment'))->inject(
                H::table(['id' => $prefix.'_stocks_table', 'class' => 'table table-striped table-hover'])->inject(
                    H::thead(
                        H::tr(
                            H::th(H::div(__('Id'))).
                            H::th(H::div(__('Quantity'))).
                            H::th(H::div(__('Color'))).
                            H::th(H::div(__('Size'))).
                            H::th(H::div(__('SKU'))).
                            ''
                        ).
                        ''
                    ).
                    H::tbody()
                )
            ).
            H::div(array('id' => $prefix.'_orders', 'class' => 'segment'))->inject(
                H::table(['id' => $prefix.'_orders_table', 'class' => 'table table-striped table-hover'])->inject(
                    H::thead(
                        H::tr(
                            H::th(H::div(__('Name'))).
                            H::th(H::div(__('Street'))).
                            H::th(H::div(__('City'))).
                            H::th(H::div(__('State'))).
                            H::th(H::div(__('Zip'))).
                            H::th(H::div(__('Country'))).
                            H::th(H::div(__('Status'))).
                            H::th(H::div(__('Created'))).
                            ''
                        ).
                        ''
                    ).
                    H::tbody()
                )
            )
        )
    ;
    
    $buttons = 
        H::btn(array('prefix' => $prefix, 'action' => 'add', 'class' => 'btn-last', 'text' => T::_('Create'))).
        H::btn(array('prefix' => $prefix, 'action' => 'del', 'text' => T::_('Delete'))).
        H::btn(array('prefix' => $prefix, 'action' => 'upd', 'class' => 'btn-last', 'text' => T::_('Update')))
    ;
    
    echo sprintf($template, $class, $prefix, $title, $content, $buttons);
