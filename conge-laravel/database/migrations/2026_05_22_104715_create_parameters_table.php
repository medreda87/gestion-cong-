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
        Schema::create('parameters', function (Blueprint $table) {
            $table->id();

            // user lié au paramétrage
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // référence
            $table->string('cfpt_code')->default('CFPT1');
            $table->string('direction_code')->default('DC');

            // décision délégation
            $table->string('delegation_number')->nullable();
            $table->date('delegation_date')->nullable();

            // signataire
            $table->string('directeur_name')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parameters');
    }
};
