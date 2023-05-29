const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 | Details on replacing Vite with WebPack: https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md#migrating-from-vite-to-laravel-mix
 |
 */
mix.js('resources/js/app.js', 'public/js')
    .combine([
		'resources/js/packages/phpjs/1.0/phpjs.custom.js',
        'resources/js/packages/jquery/plugins/isset/1.0/jquery.isset.js',
        'resources/js/packages/jquery/plugins/center/1.0/jquery.center.js',
		'resources/js/packages/bootstrap/plugins/bootbox/6.0.0/bootbox.all.js',
		'resources/js/packages/jquery/plugins/cookie/1.4.1/jquery.cookie.js',
		'resources/js/packages/jquery/plugins/mousewheel/3.1.3/jquery.mousewheel.js',
		'resources/js/packages/jquery/plugins/blockui/2.7.0/ocms.jquery.blockui.js',
		'resources/js/packages/jquery/plugins/alterclass/1.0/jquery.alterclass.js',
		'resources/js/packages/jquery/plugins/hasanyclass/1.0/jquery.hasanyclass.js',
		'resources/js/packages/jquery/plugins/hasallclasses/1.0/jquery.hasallclasses.js',
		'resources/js/packages/jquery/plugins/addbackif/1.0/jquery.addbackif.js',
        'resources/js/packages/jquery/plugins/outerhtml/1.0/jquery.outerhtml.js',
		'resources/js/packages/jquery/plugins/cerealize/1.0/jquery.cerealize.js',
		'resources/js/packages/jquery/plugins/cerealizearray/1.0/jquery.cerealizearray.js',
		'resources/js/packages/jquery/plugins/decerealize/1.0/jquery.decerealize.js',
    ], 'public/js/boutique_packages.js').minify('public/js/boutique_packages.js')
    .combine([
        'resources/js/libraries/boutique/1.0/Boutique.js',
        'resources/js/libraries/boutique/1.0/Boutique.Inflection.js',
        'resources/js/libraries/boutique/1.0/Boutique.Settings.js',
        'resources/js/libraries/boutique/1.0/Boutique.Utilities.js',
        'resources/js/libraries/boutique/1.0/Boutique.Messages.js',
        'resources/js/libraries/boutique/1.0/Boutique.Storage.js',
        'resources/js/libraries/boutique/1.0/Boutique.Validator.js',
        'resources/js/libraries/boutique/1.0/Boutique.Controllers.Product.js',
    ], 'public/js/boutique_libraries.js').minify('public/js/boutique_libraries.js')
    .combine([
    ], 'public/css/boutique_packages.css').minify('public/css/boutique_packages.css')
    .sass('resources/sass/app.scss', 'public/css')
    .options({
        processCssUrls: false
    })
    .sourceMaps()
    .webpackConfig(webpack => {
        return {
            plugins: [
                // Fixes warning in moment-with-locales.min.js
                //   Module not found: Error: Can't resolve './locale' in ...
                new webpack.IgnorePlugin({
                    resourceRegExp: /^\.\/locale$/,
                    contextRegExp: /moment$/,
                })
            ],
            devtool: 'source-map'
        }
    })
;