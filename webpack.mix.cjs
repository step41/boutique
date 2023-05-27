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
mix.js('resources/js/packages/jquery/3.5.1/jquery.min.js', 'public/js')
    .js('resources/js/app.js', 'public/js')
    .combine([
		//'resources/js/packages/bootstrap/3.3.2/dist/js/bootstrap.min.js',
        //'node_modules/bootstrap/dist/js/bootstrap.min.js',
		'resources/js/packages/phpjs/1.0/phpjs.custom.packed.js',
		'resources/js/packages/uuid/0.3/uuid.packed.js',
		//'resources/js/packages/bootstrap/plugins/bootstrap-select/dist/js/bootstrap-select.js',
		'resources/js/packages/bootstrap/plugins/bootbox/4.3.0/ocms.bootbox.packed.js',
		'resources/js/packages/jquery/plugins/cookie/1.4.1/jquery.cookie.packed.js',
		'resources/js/packages/jquery/plugins/mousewheel/3.1.3/jquery.mousewheel.packed.js',
		'resources/js/packages/jquery/plugins/blockui/2.7.0/ocms.jquery.blockui.packed.js',
		'resources/js/packages/jquery/plugins/center/1.0/jquery.center.packed.js',
		'resources/js/packages/jquery/plugins/isset/1.0/jquery.isset.packed.js',
		'resources/js/packages/jquery/plugins/outerhtml/1.0/jquery.outerhtml.packed.js',
		'resources/js/packages/jquery/plugins/hiddendims/1.0/jquery.hiddendims.packed.js',
		'resources/js/packages/jquery/plugins/tablescroll/1.0/ocms.jquery.tablescroll.packed.js',
		'resources/js/packages/jquery/plugins/hoverintent/1.0/jquery.hoverintent.min.js',
		'resources/js/packages/jquery/plugins/alterclass/1.0/jquery.alterclass.packed.js',
		'resources/js/packages/jquery/plugins/hasanyclass/1.0/jquery.hasanyclass.packed.js',
		'resources/js/packages/jquery/plugins/hasallclasses/1.0/jquery.hasallclasses.packed.js',
		'resources/js/packages/jquery/plugins/addbackif/1.0/jquery.addbackif.packed.js',
		'resources/js/packages/jquery/plugins/touchpunch/0.2.3/jquery.ui.touch-punch.min.js',
		'resources/js/packages/jquery/plugins/attrs/1.0/jquery.attrs.packed.js',
		'resources/js/packages/jquery/plugins/cerealize/1.0/jquery.cerealize.packed.js',
		'resources/js/packages/jquery/plugins/cerealizearray/1.0/jquery.cerealizearray.packed.js',
		'resources/js/packages/jquery/plugins/decerealize/1.0/jquery.decerealize.packed.js',
    ], 'public/js/boutique_packages.js').minify('public/js/boutique_packages.js')
    .combine([
        'resources/js/libraries/boutique/1.0/Boutique.js',
        'resources/js/libraries/boutique/1.0/Boutique.Inflection.js',
        'resources/js/libraries/boutique/1.0/Boutique.Utilities.js',
        'resources/js/libraries/boutique/1.0/Boutique.Settings.js',
        'resources/js/libraries/boutique/1.0/Boutique.Messages.js',
        'resources/js/libraries/boutique/1.0/Boutique.Storage.js',
        'resources/js/libraries/boutique/1.0/Boutique.Validator.js',
        'resources/js/libraries/boutique/1.0/Boutique.Controllers.Product.js',
    ], 'public/js/boutique_libraries.js').minify('public/js/boutique_libraries.js')
    .combine([
        //'resources/js/packages/bootstrap/plugins/bootstrap-select/dist/css/bootstrap-select.css',
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