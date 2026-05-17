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

            $table->dropForeign(['responsable_id']);
            $table->dropForeign(['interimaire_id']);

            $table->dropColumn('responsable_id');
            $table->dropColumn('interimaire_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->foreignId('responsable_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->foreignId('interimaire_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
        });
    }
};
