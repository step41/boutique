<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

// Rather than utilize Route::resource, we'll be a bit more explicit here since our CRUD functionality differs slightly in operation
Route::get('/products', [App\Http\Controllers\ProductController::class, 'index'])->name('product.index');
Route::get('/products/{id}', [App\Http\Controllers\ProductController::class, 'edit'])->name('product.edit');
Route::post('/products', [App\Http\Controllers\ProductController::class, 'store'])->name('product.store');
Route::put('/products/{id}', [App\Http\Controllers\ProductController::class, 'update'])->name('product.update');
Route::delete('/products/{id}', [App\Http\Controllers\ProductController::class, 'destroy'])->name('product.destroy');
