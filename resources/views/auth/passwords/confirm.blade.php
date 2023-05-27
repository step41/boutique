<?php

    $output = $content = '';
    $title = __('Confirm Password');
    $content .= 
        __('Please confirm your password before continuing.').
        H::form(['action' => route('password.confirm')])->inject(
            H::boutiquePassword([], $errors).
            H::div(['class' => 'row mb-0'])->inject(
                H::div(['class' => 'col-md-8 offset-md-4'])->inject(
                    H::submit(['class' => 'btn-primary', 'text' => $title]).
                    ((Route::has('password.request')) ? H::a([
                        'class' => 'btn btn-link', 
                        'href' => route('password.request'), 
                        'text' => __('Forgot Your Password?')
                    ]) : '')
                )                                    
            )
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
                <div class="card-header">{{ __('Confirm Password') }}</div>

                <div class="card-body">
                    {{ __('Please confirm your password before continuing.') }}

                    <form method="POST" action="{{ route('password.confirm') }}">
                        @csrf

                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-end">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Confirm Password') }}
                                </button>

                                @if (Route::has('password.request'))
                                    <a class="btn btn-link" href="{{ route('password.request') }}">
                                        {{ __('Forgot Your Password?') }}
                                    </a>
                                @endif
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
*/