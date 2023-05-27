<?php

    $output = $content = $alert = '';
    $title = __('Verify Your Email Address');

    if (session('resent')):
        $alert .= H::div([
            'class' => 'alert alert-success', 
            'role' => 'alert', 
            'text' => __('A fresh verification link has been sent to your email address.')
        ]);
    endif;
    $content .= 
        __('Before proceeding, please check your email for a verification link.').
        __('If you did not receive the email').
        H::form(['class' => 'd-inline', 'action' => route('verification.resend')])->inject(
            H::submit(['class' => 'btn btn-link p-0 m-0 align-baseline', 'text' => __('click here to request another')])
        )
    ;
    $output = H::boutiqueLayout(['title' => $title, 'text' => $content]);

    echo $output;

/*
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Verify Your Email Address') }}</div>

                <div class="card-body">
                    @if (session('resent'))
                        <div class="alert alert-success" role="alert">
                            {{ __('A fresh verification link has been sent to your email address.') }}
                        </div>
                    @endif

                    {{ __('Before proceeding, please check your email for a verification link.') }}
                    {{ __('If you did not receive the email') }},
                    <form class="d-inline" method="POST" action="{{ route('verification.resend') }}">
                        @csrf
                        <button type="submit" class="btn btn-link p-0 m-0 align-baseline">{{ __('click here to request another') }}</button>.
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
