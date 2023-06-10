<?php 

    $output = $content = $links = '';
    $title = H::h4(H::i(['class' => 'bi-speedometer']).'&nbsp; Dashboard');
    $actions = [
        'order'     => 'cart',
        'product'   => 'bag',
        'stock'     => 'building',
        'user'      => 'person-circle',
    ];

    foreach ($actions as $action => $icon):

        if (Auth::user() && Auth::user()->hasPermissionTo('view '.INF::pluralize($action))):

            $links .= 
                H::li(H::a([
                    'class' => 'btn btn-link', 
                    'href' => route($action.'.index'), 
                    'text' => H::i(['class' => 'bi-'.$icon]).' &nbsp; View '.ucfirst(INF::pluralize($action)),
                ]))
            ;

        endif;
    
    endforeach;


    $content .= 
        H::form()->inject(
            H::div(['class' => 'content'])->inject(
                H::ul('', ['class' => 'list-dashboard'])->inject(
                    H::li(['class' => ''])->inject(
                        H::a([
                            'class' => 'btn btn-link', 
                            'href' => route('page.overview'), 
                            'text' => H::i(['class' => 'bi-clipboard-data']).' &nbsp; '.__('View Statistics')
                        ])
                    ).
                    $links
                )
            )
        )
    ;
    $output = H::boutiqueLayout(['title' => $title, 'text' => $content]);

    echo $output;
