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
        $users = User::with([
            'detailUser',
            'detailJobUser'
        ])->get();

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
        $user = User::with([
        'detailUser',
        'detailJobUser'
        ])->findOrFail($id);

        return response()->json($user);
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
    public function getInterimaires($id)
    {
        $user = User::findOrFail($id);

        $interimaires = User::where('efp_travail', $user->efp_travail)
            ->where('id', '!=', $user->id)
            ->get();

        return response()->json($interimaires);
    }
    };