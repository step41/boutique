<?php


    $class = '';
    $prefix = 'product';
	$template = H::dialog($prefix, 'modal-lg');
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
            H::select($capabilityTypes, array(
                'id' => $prefix.'_types',
                'label' => T::_('Capability Types'),
                'multiple' => TRUE, 
                'help' => T::_('THIS FEATURE NOT YET ENABLED! - Select one or more types to limit creation to selected types only, or leave unselected to generate all types.')
            )).
            H::select($ables, array(
                'id' => $prefix.'_enabled',
                'label' => T::_('Capability Status'),
                'value' => 1, 
            )).
            H::select($ables, array(
                'id' => $prefix.'_visitor',
                'label' => T::_('Visitor Access'),
                'value' => 0, 
            )).
            H::select($ables, array(
                'id' => $prefix.'_subscriber',
                'label' => T::_('Subscriber Access'),
                'value' => 0, 
            )).
            H::select($ables, array(
                'id' => $prefix.'_author',
                'label' => T::_('Author Access'),
                'value' => 0, 
            )).
            H::select($ables, array(
                'id' => $prefix.'_manager',
                'label' => T::_('Manager Access'),
                'value' => 0, 
            )).
            H::select($ables, array(
                'id' => $prefix.'_administrator',
                'label' => T::_('Administrator Access'),
                'value' => 0, 
            )).
            H::select($ables, array(
                'id' => $prefix.'_superadmin',
                'label' => T::_('Super Admin Access'),
                'value' => 1, 
            )).
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
    