<?php 

    $output = $content = $status = '';
    $title = __('Dashboard');

    if (session('status')):
        $status .= H::div(['class' => 'alert alert-success', 'role' => 'alert', 'text' => session('status')]);
    endif;

    $content .= 
        H::form()->inject(
            H::ul('', ['class' => ''])->inject(
                H::li(['class' => ''])->inject(
                    H::a([
                        'class' => 'btn btn-link', 
                        'href' => route('product.index'), 
                        'text' => __('Products')
                    ])
                )                              
            )
        )
    ;
    $output = H::boutiqueLayout(['title' => $title, 'text' => $content]);

    echo $output;
