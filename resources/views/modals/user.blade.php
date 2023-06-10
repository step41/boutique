<?php


    $class = '';
    $prefix = 'user';
	$template = H::boutiqueDialog($prefix, 'modal-lg');
    $title = T::_('User Properties');
    $isElv = Auth::user() && Auth::user()->hasPermissionTo('manage users');
    $plans = [
        'Boutique',
        'Enterprise',
        'Startup',
    ];
    $cards = [
        'Amex',
        'Discover',
        'Mastercard',
        'Via',
    ];

    $content = 
        H::form(array('id' => $prefix.'_form_write'))->inject(
            H::hidden(array('id' => 'id')).
            H::select($roles, array(
                'id' => 'role_id', 
                'label' => T::_('User Role'), 
                'blankoption' => 'Select a role ...',
                'required' => TRUE,
            )).
            H::select(array_combine($plans, $plans), array(
                'id' => 'billing_plan', 
                'label' => T::_('User Billing Plan'), 
                'blankoption' => 'Select a billing plan ...',
                'required' => TRUE,
            )).
            H::select(array_combine($cards, $cards), array(
                'id' => 'card_brand', 
                'label' => T::_('User Card Brand'), 
                'blankoption' => 'Select a card brand ...',
                'required' => TRUE,
            )).
            H::text(array(
                'id' => 'name', 
                'label' => T::_('User Name'), 
                'validate' => array(
                    'required' => TRUE,
                    'lengthMax' => 100,
                ), 
            )).
            H::email(array(
                'id' => 'email', 
                'label' => T::_('User E-mail'), 
                'maxlength' => '100',
                'validate' => array(
                    'required' => TRUE,
                    'email' => TRUE,
                    'lengthMax' => 100,
                ), 
            )).
            H::text(array(
                'id' => 'shop_name', 
                'label' => T::_('User Shop'), 
                'required' => TRUE,
            )).
            H::password(array(
                'id' => 'password', 
                'label' => T::_('New Password'), 
                'placeholder' => T::_('Enter a new password to change the current'), 
                'validate' => array(
                    'required' => TRUE,
                    'lengthBetween' => array(config('constants.VALIDATION_PWD_LENGTHMIN'), config('constants.VALIDATION_PWD_LENGTHMAX')),
                    'matchesField' => array('password_confirm', 'Confirm Password'),
                    'ifSet' => 'password, password_confirm',
                ), 
            )).
            H::password(array(
                'id' => 'password_confirm', 
                'label' => T::_('Confirm Password'), 
                'placeholder' => T::_('Confirm new password to change the current'), 
                'validate' => array(
                    'required' => TRUE,
                    'matchesField' => array('password', 'New Password'),
                    'ifSet' => 'password',
                ), 
            )).
            H::text(array(
                'id' => 'shop_domain', 
                'label' => T::_('User Domain'), 
                'required' => TRUE,
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
