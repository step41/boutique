<?php 

    $output = '';
    $status = '';

    if (session('status')):
        $status .= H::div(['class' => 'alert alert-success', 'role' => 'alert', 'text' => session('status')]);
    endif;

    $output .= 
        H::blade('layouts.head').
        H::container(
            H::div(['class' => 'row justify-content-center'])->inject(
                H::div(['class' => 'col-md-8'])->inject(
                    H::div(['class' => 'card'])->inject(
                        H::div(['class' => 'card-header', 'text' => __('Dashboard')]).
                        H::div(['class' => 'card-body', 'text' => $status.__('You are logged in!')])
                    )
                )
            ).
            ''
        ).
        H::blade('layouts.foot')
    ;

    echo $output;

