<?php


    $args = get_defined_vars();
    $output = '';
    $links = '';
    $content = '';

    //dd($errors->has('email'));

    if (Auth::guest()):
        if (Route::has('login')):
            $links .= H::li(['class' => 'nav-item', 'text' => H::a(['class' => 'nav-link', 'href' => route('login'), 'text' => __('Login')])]);
        endif;
        if (Route::has('register')):
            $links .= H::li(['class' => 'nav-item', 'text' => H::a(['class' => 'nav-link', 'href' => route('register'), 'text' => __('Register')])]);
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
                'text' => Auth::user()->name
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
        H::htmlopen(['lang' => str_replace('_', '-', app()->getLocale())]).
            H::head(
                H::metacharset().
                H::metaport().

                H::comment('CSRF Token').
                H::metacsrf(csrf_token()).
                H::title(config('app.name')).
                
                H::comment('Fonts').
                H::prefetch('//fonts.bunny.net').
                H::stylesheet('https://fonts.bunny.net/css?family=Nunito').
                
                H::comment('Styles').
                H::stylesheet('/css/app.css').
                
                H::comment('Scripts').
                H::script('/js/app.js').

                //@vite(['resources/sass/app.scss', 'resources/js/app.js'])

                ''
            ).
            H::body(
                H::div(['id' => 'app'])->inject(
                    H::nav(['class' => 'navbar navbar-expand-md navbar-light bg-white shadow-sm'])->inject(
                        H::container(
                            H::a(['class' => 'navbar-brand', 'href' => url('/'), 'text' => config('app.name')]).
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
                    ).
                    H::main(['class' => 'py-4'])->inject(
                        H::blade('layouts.content', $args)
                    )        
                )
            ).
        H::htmlclose()
    ;

    echo $output;


/*
<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito" rel="stylesheet">

    <!-- Scripts -->
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    <script src="{{ mix('js/app.js') }}" defer></script>
    <?php //@vite(['resources/sass/app.scss', 'resources/js/app.js']) ?>
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/') }}">
                    {{ config('app.name', 'Laravel') }}
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav me-auto">

                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ms-auto">
                        <!-- Authentication Links -->
                        @guest
                            @if (Route::has('login'))
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                                </li>
                            @endif

                            @if (Route::has('register'))
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                                </li>
                            @endif
                        @else
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    {{ Auth::user()->name }}
                                </a>

                                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('logout') }}"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        {{ __('Logout') }}
                                    </a>

                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                        @csrf
                                    </form>
                                </div>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <main class="py-4">
            @yield('content')
        </main>
    </div>
</body>
</html>
*/
