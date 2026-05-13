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
                $table->dropColumn(['cin', 'date_naissance', 'adresse', 'ville', 'telephone', 'photo']);
                $table->dropColumn(['fonction','nature_fonction', 'echelle', 'categorie', 'grade', 'diplome', 'specialite', 'date_recrutement', 'date_prise_service', 'recode_annee_ant']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
                $table->string('cin')->nullable();
                $table->date('date_naissance')->nullable();
                $table->text('adresse')->nullable();
                $table->string('ville')->nullable();
                $table->string('telephone')->nullable();
                $table->string('photo')->nullable();

                $table->string('fonction')->nullable();
                $table->string('nature_fonction')->nullable();
                $table->integer('echelle')->nullable();
                $table->integer('categorie')->nullable();
                $table->integer('grade')->nullable();
                $table->string('diplome')->nullable();
                $table->string('specialite')->nullable();
                $table->date('date_recrutement')->nullable();
                $table->date('date_prise_service')->nullable();
                $table->decimal('recode_annee_ant', 10, 2)->nullable();
        });
    }
};
