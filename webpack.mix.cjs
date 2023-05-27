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
        'resources/js/libraries/boutique/1.0/Boutique.js',
        'resources/js/libraries/boutique/1.0/Boutique.Inflection.js',
        'resources/js/libraries/boutique/1.0/Boutique.Utilities.js',
        'resources/js/libraries/boutique/1.0/Boutique.Settings.js',
        'resources/js/libraries/boutique/1.0/Boutique.Messages.js',
        'resources/js/libraries/boutique/1.0/Boutique.Storage.js',
        'resources/js/libraries/boutique/1.0/Boutique.Validator.js',
        'resources/js/libraries/boutique/1.0/Boutique.Controllers.Product.js',
    ], 'public/js/boutique_libraries.js').minify('public/js/boutique_libraries.js')
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