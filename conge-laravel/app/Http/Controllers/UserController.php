<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\UsersImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\User;
class UserController extends Controller
{
    public function import(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:xlsx,xls,csv|max:2048'
    ]);

    try {
        Excel::import(new UsersImport, $request->file('file'));

        return response()->json([
            'status' => true,
            'message' => 'Import terminé ✅'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Erreur import ❌',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function getAllUsers()
{
    $users = User::all();
    return response()->json($users);
}
public function updatUser(Request $request, $id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $user->update($request->all());

    return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'user' => $user]);
}
public function show($id)
{
    return User::findOrFail($id);
}
public function destroy($id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $user->delete();

    return response()->json(['message' => 'Utilisateur supprimé avec succès']);
}
};