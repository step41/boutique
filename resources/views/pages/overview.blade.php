<?php 

    $output = '';
    $title = H::h4(H::a(['href' => route('dashboard'), 'text' => H::i(['class' => 'bi-speedometer']).'&nbsp; Dashboard: ']).' &nbsp;My Overview');

    $output .= 
        H::boutiqueLayout([
            'title' => $title, 
            'button' => '',
            'text' => H::form(['id' => 'overview_form_list'])->inject(
                H::boutiqueHiddenFields().
                H::div(['class' => 'content'])->inject(

                    H::div(['class' => 'orders-total'])->inject(
                        H::h5('Total earned to date: '.$statistics['sum'])
                    ).
                    H::div(['class' => 'orders-average'])->inject(
                        H::h5('Average earned per order: '.$statistics['avg'])
                    )
                )
            )
        ])
    ;

    echo $output;

