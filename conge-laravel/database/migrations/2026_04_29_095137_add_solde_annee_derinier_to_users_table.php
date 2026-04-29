<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
             $table->decimal('solde_annee_derniere', 8, 2)
                  ->default(0)
                  ->after('role');

            $table->decimal('solde_annee_precedente', 8, 2)
                  ->default(0)
                  ->after('solde_annee_derniere');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
             $table->dropColumn([
                'solde_annee_derniere',
                'solde_annee_precedente'
            ]);
        });
    }
};
