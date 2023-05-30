<?php 

    $output = $content = $status = '';
    $title = H::h4(H::i(['class' => 'bi-speedometer']).'&nbsp; Dashboard');

    if (session('status')):
        $status .= H::div(['class' => 'alert alert-success', 'role' => 'alert', 'text' => session('status')]);
    endif;

    $content .= 
        H::form()->inject(
            H::div(['class' => 'content'])->inject(
                H::ul('', ['class' => 'list-dashboard'])->inject(
                    H::li(['class' => ''])->inject(
                        H::a([
                            'class' => 'btn btn-link', 
                            'href' => route('product.index'), 
                            'text' => H::i(['class' => 'bi-bag']).' &nbsp; '.__('View Products')
                        ])
                    ).
                    H::li(['class' => ''])->inject(
                        H::a([
                            'class' => 'btn btn-link', 
                            'href' => route('order.index'), 
                            'text' => H::i(['class' => 'bi-cart']).' &nbsp; '.__('View Orders')
                        ])
                    ).
                    H::li(['class' => ''])->inject(
                        H::a([
                            'class' => 'btn btn-link', 
                            'href' => route('stock.index'), 
                            'text' => H::i(['class' => 'bi-building']).' &nbsp; '.__('View Stocks')
                        ])
                    )
                )
            )
        )
    ;
    $output = H::boutiqueLayout(['title' => $title, 'text' => $content]);

    echo $output;
