<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('laporans', function (Blueprint $table) {
            // Hapus constraint foreign key sementara
            $table->dropForeign(['siswa_id']);
            
            // Ubah kolom menjadi nullable
            $table->foreignId('siswa_id')->nullable()->change();
            
            // Tambahkan kembali foreign key dengan nullable
            $table->foreign('siswa_id')->references('id')->on('siswas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('laporans', function (Blueprint $table) {
            $table->dropForeign(['siswa_id']);
            $table->foreignId('siswa_id')->change();
            $table->foreign('siswa_id')->references('id')->on('siswas')->onDelete('cascade');
        });
    }
};