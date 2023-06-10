<?php 

    $type = 'user';
    $types = INF::pluralize($type);
    $static = $dynamic = $rows = '';
    $title = H::h4(H::a(['href' => route('page.dashboard'), 'text' => H::i(['class' => 'bi-speedometer']).'&nbsp; Dashboard: ']).' &nbsp;'.ucfirst($types));

    if (!empty($users) && $users->count()):
        foreach ($users as $user):
            $rows .= 
                H::tr(
                    H::td(H::div(['data-bp' => '1200', 'text' => $user->id])).
                    H::td(H::div(['data-bp' => '992', 'text' => ucfirst($user->role_name)])).
                    H::td(H::div(['text' => ucwords($user->name)])).
                    H::td(H::div(['data-bp' => '992', 'text' => $user->email])).
                    H::td(H::div(['data-bp' => '1440', 'text' => $user->shop_name])).
                    H::td(H::div(['data-bp' => '1440', 'text' => $user->shop_domain])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $user->billing_plan])).
                    H::td(H::div(['data-bp' => '1200', 'text' => $user->card_brand])).
                    H::td(H::div(['data-bp' => '1200', 'text' => date('m/d/Y', strtotime($user->trial_starts_at))])).
                    H::td(H::div(['data-bp' => '1200', 'text' => date('m/d/Y', strtotime($user->trial_ends_at))])).
                    H::td(H::div(['data-bp' => '992', 'text' => date('m/d/Y', strtotime($user->created_at))])).
                    ((Auth::user() && Auth::user()->hasPermissionTo('update '.$types)) ? 
                        H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'copy', 'data-id' => $user->id, 'text' => __('Copy')])])).
                        H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'edit', 'data-id' => $user->id, 'text' => __('Edit')])]))
                    : '').
                    ((Auth::user() && Auth::user()->hasPermissionTo('view '.$types)) ? 
                        H::td(H::div(['text' => H::a(['href' => '#', 'data-action' => 'view', 'data-id' => $user->id, 'text' => __('View')])]))
                    : '')
                )
            ;
        endforeach;
        $dynamic .= 
            H::table(['id' => $type.'_table', 'class' => 'table table-striped table-hover'])->inject(
                H::thead(
                    H::tr(
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'id', 'text' => __('ID')])])).
                        H::th(H::div(['data-bp' => '992', 'text' => H::a(['href' => '#', 'data-orderby' => 'role_name', 'text' => __('Role')])])).
                        H::th(H::div(['text' => H::a(['href' => '#', 'data-orderby' => 'name', 'text' => __('Name')])])).
                        H::th(H::div(['data-bp' => '992', 'text' => H::a(['href' => '#', 'data-orderby' => 'email', 'text' => __('E-mail')])])).
                        H::th(H::div(['data-bp' => '1440', 'text' => H::a(['href' => '#', 'data-orderby' => 'shop_name', 'text' => __('Shop')])])).
                        H::th(H::div(['data-bp' => '1440', 'text' => H::a(['href' => '#', 'data-orderby' => 'shop_domain', 'text' => __('Domain')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'billing_plan', 'text' => __('Plan')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'card_brand', 'text' => __('Card')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'trial_starts_at', 'text' => __('Trial Start')])])).
                        H::th(H::div(['data-bp' => '1200', 'text' => H::a(['href' => '#', 'data-orderby' => 'trial_ends_at', 'text' => __('Trial End')])])).
                        H::th(H::div(['data-bp' => '992', 'text' => H::a(['href' => '#', 'data-orderby' => 'created_at', 'text' => __('Created')])])).
                        ((Auth::user() && Auth::user()->hasPermissionTo('update '.$types)) ? 
                            H::th(H::div()).
                            H::th(H::div())
                        : '').
                        ((Auth::user() && Auth::user()->hasPermissionTo('view '.$types)) ? 
                            H::th(H::div())
                        : '')
                    )
                ).
                H::tbody($rows)
            ).
            H::div(['class' => 'd-flex justify-content-center', 'text' => $users->links()])
        ;
    else:
        $dynamic .= H::h4(['class' => 'msg-no-records', 'text' => 'No '.$types.' found']);
    endif;

    $button = H::button(['id' => $type.'_show', 'class' => 'btn-md btn-primary float-end', 'data-action' => 'add', 'text' => 'Add '.ucfirst($type)]);
    $static .= 
        H::boutiqueLayout([
            'title' => $title, 
            'button' => $button,
            'text' => H::form(['id' => $type.'_form_list'])->inject(
                H::boutiqueHiddenFields().
                H::boutiqueSearchFields().
                H::div(['data-async' => TRUE])
                // table content will be dynamically loaded here...
            ),
            'modal' => H::blade('modals.'.$type, get_defined_vars())
        ])
    ;

    $output = (COM::isAjaxRequest()) ? $dynamic : $static;

    echo $output;
