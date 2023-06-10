<?php

    $output = '';
    $links = '';

    if (Auth::guest()):
        if (Route::has('login')):
            $links .= H::li(['class' => 'nav-item', 'text' => H::a(['class' => 'nav-link', 'href' => route('login'), 'text' => __('Login')])]);
        endif;
        if (Route::has('register')):
            //$links .= H::li(['class' => 'nav-item', 'text' => H::a(['class' => 'nav-link', 'href' => route('register'), 'text' => __('Register')])]);
        endif;
    else:
        $links .= H::li(['class' => 'nav-item dropdown'])->inject(
            H::a([
                'id' => 'navbarDropdown', 
                'class' => 'nav-link dropdown-toggle', 
                'href' => '#',
                'role' => 'button',
                'data-bs-toggle' => 'dropdown',
                'aria-haspopup' => 'true',
                'aria-expanded' => 'false',
                'v-pre' => TRUE,
                'data-active-user-id' => Auth::user()->id,
                'text' => 
                    H::span(['class' => 'active-user-name', 'text' => Auth::user()->name]).
                    ' :: '.
                    H::span(['class' => 'active-user-role', 'text' => ucfirst(Auth::user()->getRoleNames()->first())]),
            ]).
            H::div(['class' => 'dropdown-menu dropdown-menu-end', 'aria-labelledby' => 'navbarDropdown'])->inject(
                H::a([
                    'class' => 'dropdown-item', 
                    'href' => route('logout'), 
                    'onclick' => 'event.preventDefault(); document.getElementById(\'logout-form\').submit();',
                    'text' => __('Logout')
                ]).
                H::form(['id' => 'logout-form', 'action' => route('logout'), 'class' => 'd-none'])
            )
        );
    endif;

    $output .= 
        H::doctype().
        H::htmlopen(['lang' => str_replace('_', '-', app()->getLocale()), 'data-bs-theme' => 'dark']).
            H::head(
                H::metacharset().
                H::metaport().

                H::comment('CSRF Token').
                H::metacsrf(csrf_token()).
                H::title(config('app.name')).
                
                H::comment('Fonts').
                H::prefetch('//fonts.bunny.net').
                H::stylesheet('https://fonts.bunny.net/css?family=Nunito').
                H::stylesheet('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css').
                
                H::comment('Styles').
                H::stylesheet('/css/app.css').
                H::stylesheet('/css/boutique_packages.css').
                
                H::comment('Scripts').
                H::script('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js').          
                H::script('/js/app.js').
                H::script('/js/boutique_packages.js').
                H::script('/js/boutique_libraries.js').

                //@vite(['resources/sass/app.scss', 'resources/js/app.js'])

                ''
            ).
            H::body(['close' => FALSE]).
                H::div(['id' => 'app', 'close' => FALSE]).
                    H::header(['id' => 'header'])->inject(
                        H::nav(['class' => 'navbar navbar-expand-md navbar-dark shadow-lg'])->inject(
                            H::container(
                                H::a(['class' => 'navbar-brand', 'href' => url('/'), 'text' => H::i(['class' => 'bi-shop']).' &nbsp;'.config('app.name')]).
                                H::button([
                                    'class' => 'navbar-toggler', 
                                    'data-bs-toggle' => 'collapse', 
                                    'data-bs-target' => '#navbarSupportedContent',
                                    'aria-controls' => 'navbarSupportedContent',
                                    'aria-expanded' => 'false',
                                    'aria-label' => __('Toggle navigation'),
                                    'text' => H::span(['class' => 'navbar-toggler-icon'])
                                ]).
                                H::div(['id' => 'navbarSupportedContent', 'class' => 'collapse navbar-collapse'])->inject(
                                    H::comment('Left Side Of Navbar').
                                    H::ul('', ['class' => 'navbar-nav me-auto']).
                                    H::comment('Right Side Of Navbar').
                                    H::ul('', ['class' => 'navbar-nav ms-auto'])->inject(
                                        H::comment('Authentication Links').
                                        $links
                                    )
                                )
                            )
                        )
                    ).
                    H::main(['class' => 'py-4', 'close' => FALSE])
            
    ;

    echo $output;

