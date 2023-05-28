<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;
use App\Helpers\ArrayHelper;
use App\Helpers\CommonHelper;
use App\Helpers\DirFileHelper;
use App\Helpers\HtmlHelper;
use App\Helpers\InflectionHelper;
use App\Helpers\JudyHelper;
use App\Helpers\NumericHelper;
use App\Helpers\StringHelper;
use App\Helpers\TranslationHelper;
use App\Helpers\UTFHelper;
use App\Classes\Message;
use App\Classes\Validator;

class BoutiqueServiceProvider extends ServiceProvider {

    /**
     * Register services.
     *
     * @return void
     */
    public function register() {

        $binds = array(

            'ArrayHelper' => function() { 
                return new ArrayHelper(); 
            },
            'CommonHelper' => function() { 
                return new CommonHelper(); 
            },
            'DirFileHelper' => function() { 
                return new DirFileHelper(); 
            },
            'HtmlHelper' => function() { 
                return new HtmlHelper(); 
            },
            'InflectionHelper' => function() { 
                return new InflectionHelper(); 
            },
            'JudyHelper' => function() { 
                return new JudyHelper(); 
            },
            'Message' => function() { 
                return new Message(); 
            },
            'NumericHelper' => function() { 
                return new NumericHelper(); 
            },
            'StringHelper' => function() { 
                return new StringHelper(); 
            },
            'TranslationHelper' => function() { 
                return new TranslationHelper(); 
            },
            'UTFHelper' => function() { 
                return new UTFHelper(); 
            },
            'Validator' => function() { 
                return new Validator(); 
            },

        );

        foreach ($binds as $class => $function):
            App::bind($class, $function);
        endforeach;

    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot() {

    }
    
}
