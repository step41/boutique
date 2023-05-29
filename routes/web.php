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

Auth::routes();

Route::get('/', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

Route::get('/products', [App\Http\Controllers\ProductController::class, 'index'])->name('product.index');
Route::get('/products/{id}', [App\Http\Controllers\ProductController::class, 'edit'])->name('product.edit');
Route::post('/products', [App\Http\Controllers\ProductController::class, 'store'])->name('product.store');
Route::put('/products/{id}', [App\Http\Controllers\ProductController::class, 'update'])->name('product.update');
Route::delete('/products/{id}', [App\Http\Controllers\ProductController::class, 'destroy'])->name('product.destroy');

Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index'])->name('order.index');
Route::get('/orders/{id}', [App\Http\Controllers\OrderController::class, 'edit'])->name('order.edit');
Route::post('/orders', [App\Http\Controllers\OrderController::class, 'store'])->name('order.store');
Route::put('/orders/{id}', [App\Http\Controllers\OrderController::class, 'update'])->name('order.update');
Route::delete('/orders/{id}', [App\Http\Controllers\OrderController::class, 'destroy'])->name('order.destroy');

Route::get('/stocks', [App\Http\Controllers\StockController::class, 'index'])->name('stock.index');
Route::get('/stocks/{id}', [App\Http\Controllers\StockController::class, 'edit'])->name('stock.edit');
Route::post('/stocks', [App\Http\Controllers\StockController::class, 'store'])->name('stock.store');
Route::put('/stocks/{id}', [App\Http\Controllers\StockController::class, 'update'])->name('stock.update');
Route::delete('/stocks/{id}', [App\Http\Controllers\StockController::class, 'destroy'])->name('stock.destroy');
