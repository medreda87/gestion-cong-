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
        Schema::create('detail_job_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
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
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_job_users');
    }
};
