<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\SoldeCongeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ParameterController;

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


Route::get('/', function () {
    return redirect('/login');
});

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
    Route::get('/demandeHistory',[DemandeController::class,'getDemandeHistory']);
    Route::get('/my-demandes',[DemandeController::class,'getMyDemandes']);
    Route::post('/store_demande',[DemandeController::class,'store']);
    Route::put('/demandes/{id}/status', [DemandeController::class, 'updateStatus']);
    Route::patch('/demandes/{id}/cancel', [DemandeController::class, 'cancel']);
    Route::delete('/demandes/{id}', [DemandeController::class, 'destroy']);
});


Route::middleware('auth:api')->group(function (){
    Route::get('/holidays', [HolidayController::class, 'index']);
    Route::post('/holidays', [HolidayController::class, 'store']);
    Route::delete('/holidays/{id}', [HolidayController::class, 'destroy']);
    Route::put('/holidays/{id}', [HolidayController::class, 'update']);
    Route::post('/holidays/recalcule', [HolidayController::class, 'recalculateAllDemandes']);
});


Route::post('/import-users', [UserController::class, 'import']);
Route::get('/users', [UserController::class, 'getAllUsers']);
Route::put('/users/{id}', [UserController::class, 'updatUser']);   
Route::get('/users/{id}', [UserController::class, 'show']); 
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/interimaires/{id}', [UserController::class, 'getInterimaires']);


Route::put('/demandes/{id}/validate', [LeaveController::class, 'validateLeave']);

Route::get('/documents', [DocumentController::class, 'index']);
Route::post('/documents', [DocumentController::class, 'store']);
Route::delete('/documents/{id}', [DocumentController::class, 'destroy']); 

Route::middleware('auth:api')->group(function () {

    Route::get('/parametrage', [ParameterController::class, 'index']);

    Route::post('/parametrage/add', [ParameterController::class, 'store']);

    Route::post('/parametrage/update/{id}', [ParameterController::class, 'update']);

    Route::delete('/parametrage/delete/{id}', [ParameterController::class, 'destroy']);

});
