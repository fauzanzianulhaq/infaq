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
        Schema::create('laporans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->comment('Guru yg menerima')->constrained('users')->onDelete('cascade');
            $table->foreignId('siswa_id')->comment('Laporan ttg siswa ini')->constrained('siswas')->onDelete('cascade');
            $table->string('nama_file');
            $table->string('file_path'); // Path di storage
            $table->boolean('is_read')->default(false); // Untuk notifikasi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporans');
    }
};