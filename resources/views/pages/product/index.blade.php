<?php 

    $output = $content = $status = '';
    $title = __('Products');

    if (!empty($products)):
        $content .= $products->links();
    else:

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
