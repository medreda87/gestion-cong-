<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class authController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
    ]);   

    $credentials = $request->only('email','password');

    if (!$token = auth('api')->attempt($credentials)) {
        return response()->json([
            'message' => 'Email or password incorrect'
        ], 401);
    }

    $user = auth('api')->user();

    return response()->json([
        'message' => 'Login success',
        'token' => $token,
        'user' => $user
    ]);
}
}
