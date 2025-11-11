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
    Schema::create('pembayarans', function (Blueprint $table) {
        $table->id();
        $table->foreignId('siswa_id')->constrained()->onDelete('cascade');
        $table->integer('jumlah_bayar');
        $table->date('tanggal_bayar');
        // Kunci untuk melacak tunggakan:
        $table->integer('bulan_bayar'); // 1-12
        $table->integer('tahun_bayar'); // 2024, 2025, dst.
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
