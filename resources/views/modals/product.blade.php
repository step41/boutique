<?php


    $class = '';
    $prefix = 'product';
	$template = H::boutiqueDialog($prefix, 'modal-lg');
    $title = T::_('Product Properties');
    $ables = array(
        T::_('Disabled'), 
        T::_('Enabled')
    );
    $capabilityTypes = array(
        'view' => T::_('Viewing'),
        'add' => T::_('Adding'),
        'modify' => T::_('Modifying'),
        'delete' => T::_('Deleting'),
        'manage' => T::_('Managing'),
    );

    $content = 
        H::form(array('id' => $prefix.'_form_write'))->inject(
            H::hidden(array('id' => $prefix.'_id')).
            H::text(array(
                'id' => $prefix.'_name', 
                'label' => T::_('Capability Name'), 
                'placeholder' => T::_('Add a capability name'), 
                'maxlength' => '35',
                'validate' => array(
                    'required' => TRUE,
                    'lengthMax' => 35
                ), 
            )).
            H::text(array(
                'id' => $prefix.'_slug', 
                'label' => T::_('Capability Slug'), 
                'placeholder' => T::_('Generated automatically based on your name'), 
                'readonly' => TRUE,
            )).
            H::textarea(array(
                'id' => $prefix.'_description', 
                'label' => T::_('Capability Description'), 
                'placeholder' => T::_('Add a capability description'), 
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
    