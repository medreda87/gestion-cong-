<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login',[authController::class,'login'])->name('login');

use App\Http\Controllers\SoldeCongeController;
use App\Http\Controllers\LeaveRequestController;

Route::middleware('auth:api')->group(function () {
    Route::get('/my-solde', [SoldeCongeController::class, 'mySolde']);
    Route::get('/users/{user}/solde', [SoldeCongeController::class, 'show']);

    // Route::put('/leave-requests/{leave}/director-accept', [LeaveRequestController::class, 'directorAccept']);
});
