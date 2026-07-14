<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Imports\UsersImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\User;
use App\Models\DetailUser;
use App\Models\DetailJobUser;
use App\Models\SoldeConge;
use Illuminate\Support\Facades\DB;
class UserController extends Controller
{
public function import(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:xlsx,xls,csv|max:10240'
    ]);

    try {
        set_time_limit(0); 

        Excel::import(new UsersImport, $request->file('file'));

        return response()->json([
            'status' => true,
            'message' => 'Import terminé avec succès '
        ]);

    } catch (\Throwable $e) {

        \Log::error('IMPORT ERROR', [
            'msg' => $e->getMessage(),
            'line' => $e->getLine()
        ]);

        return response()->json([
            'status' => false,
            'message' => 'Import failed ❌',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function getAllUsers()
{
    $users = User::with(['detailUser', 'detailJobUser'])->get();
    return response()->json($users);
}
    public function updatUser(Request $request, $id)
    {
        DB::beginTransaction();

        try {

            $user =User::with(['detailUser', 'detailJobUser'])->findOrFail($id);
            $photo = optional($user->detailUser)->photo;

            if ($request->hasFile('photo')) {

        // حذف الصورة القديمة إذا كانت موجودة
        if ($photo && Storage::disk('public')->exists($photo)) {
            Storage::disk('public')->delete($photo);
        }

        // حفظ الصورة الجديدة
        $photo = $request->file('photo')->store('profiles', 'public');
    }

            $user->update([
                'matricule' => $request->matricule,
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'nom_prenom' => $request->nom_prenom,
                'nom_ar' => $request->nom_ar,
                'prenom_ar' => $request->prenom_ar,
                'actif' => $request->actif,
                'affectation' => $request->affectation,
                'efp_travail' => $request->efp_travail,
                'observation' => $request->observation,
                'role' => $request->role,
                'email' => $request->email,
                'solde_annee_derniere' => $request->solde_annee_derniere,
                'solde_annee_precedente' => $request->solde_annee_precedente,
            ]);

            // 🔥 DETAIL USER
            $user->detailUser()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'sexe' => $request->sexe,
                    'cin' => $request->cin,
                    'date_naissance' => $request->date_naissance,
                    'adresse' => $request->adresse,
                    'ville' => $request->ville,
                    'telephone' => $request->telephone,
                    'photo' => $photo, // تحديث مسار الصورة الجديدة
                ]
            );

            // 🔥 DETAIL JOB USER
            $user->detailJobUser()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'fonction' => $request->fonction,
                    'nature_fonction' => $request->nature_fonction,
                    'echelle' => $request->echelle,
                    'categorie' => $request->categorie,
                    'grade' => $request->grade,
                    'diplome' => $request->diplome,
                    'specialite' => $request->specialite,
                    'date_recrutement' => $request->date_recrutement,
                    'date_prise_service' => $request->date_prise_service,
                    'recode_annee_ant' => $request->recode_annee_ant,
                ]
            );

            DB::commit();

            return response()->json([
                'message' => 'Utilisateur mis à jour avec succès'
            ]);

        } catch (\Throwable $e) {

            DB::rollback();

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
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
        ->where('role', $user->role) 
        ->get();

    return response()->json($interimaires);
}
    };