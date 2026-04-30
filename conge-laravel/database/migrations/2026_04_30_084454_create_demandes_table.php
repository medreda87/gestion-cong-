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
        Schema::create('demandes', function (Blueprint $table)
        {
            $table->id();
             
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
           
            $table->string('type'); 

            $table->string('sub_type')->nullable();

            $table->date('start_date');
            $table->date('end_date');

            $table->text('reason')->nullable();

            $table->foreignId('interimaire_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->enum('status', [
                'pending_manager',
                'pending_director',
                'approved',
                'cancelled'
            ])->default('pending_manager');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandes');
    }
};
