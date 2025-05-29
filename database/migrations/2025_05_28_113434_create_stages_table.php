<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('stages', function (Blueprint $table) {
        $table->id();
        $table->integer('order');
        $table->string('name');
        $table->string('title');
        $table->string('subtitle')->nullable();
        $table->text('description')->nullable();
        $table->json('button_linking')->nullable();
        $table->string('image')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};
