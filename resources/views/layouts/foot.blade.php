<?php

    $output .=
        H::close('main').
        H::footer(['id' => 'footer']).
        H::close('div').
        H::close('body').
        H::htmlclose()
    ;

    echo $output;
