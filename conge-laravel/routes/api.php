<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\SoldeCongeController;

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


Route::middleware('auth:api')->group(function () {
    Route::get('/my-solde', [SoldeCongeController::class, 'mySolde']);
    Route::get('/users/{user}/solde', [SoldeCongeController::class, 'show']);

    // Route::put('/leave-requests/{leave}/director-accept', [LeaveRequestController::class, 'directorAccept']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/demandes',[DemandeController::class,'getdemande']);
    Route::post('/store_demande',[DemandeController::class,'store']);
    Route::put('/demandes/{id}/status', [DemandeController::class, 'updateStatus']);
    Route::put('/demandes/{id}/cancel', [DemandeController::class, 'cancel']);
    Route::delete('/demandes/{id}', [DemandeController::class, 'destroy']);
});


Route::middleware('auth:api')->group(function () {
    Route::get('/holidays', [HolidayController::class, 'index']);
    Route::post('/holidays', [HolidayController::class, 'store']);
    Route::delete('/holidays/{id}', [HolidayController::class, 'destroy']);
    Route::put('/holidays/{id}', [HolidayController::class, 'update']);
});
