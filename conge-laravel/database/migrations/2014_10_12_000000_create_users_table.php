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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('matricule')->nullable();
            $table->string('nom')->nullable();
            $table->string('prenom')->nullable();
            $table->string('nom_prenom')->nullable();
            $table->string('nom_ar')->nullable();
            $table->string('prenom_ar')->nullable();
            $table->string('genre')->nullable();

            $table->boolean('actif')->default(true);

            $table->string('affectation')->nullable();
            $table->integer('efp_travail')->nullable();
            $table->string('fonction')->nullable();
            $table->string('nature_fonction')->nullable();

            $table->integer('echelle')->nullable();
            $table->integer('categorie')->nullable();
            $table->integer('grade')->nullable();

            $table->string('cin')->nullable();

            $table->date('date_naissance')->nullable();
            $table->text('adresse')->nullable();
            $table->string('ville')->nullable();

            $table->string('telephone')->nullable();

            $table->string('email')->unique(); 
            $table->timestamp('email_verified_at')->nullable();

            $table->string('password'); 

            $table->string('diplome')->nullable();
            $table->string('specialite')->nullable();

            $table->date('date_recrutement')->nullable();
            $table->date('date_prise_service')->nullable();

            $table->decimal('recode_annee_ant', 10, 2)->nullable();

            $table->longText('observation')->nullable();

            $table->string('photo')->nullable();

            $table->enum('role', ['directeur', 'manager', 'employee'])->default('employee');

            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
