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
        Schema::create('solde_conges', function (Blueprint $table) {
           $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->decimal('solde_annee_precedente', 8, 2)->default(0);
            $table->decimal('total_annuel', 8, 2)->default(0);
            $table->decimal('solde_utilise', 8, 2)->default(0);
            $table->decimal('solde_restant', 8, 2)->default(0);

            $table->timestamps();

            $table->unique('user_id');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solde_conges');
    }
};
