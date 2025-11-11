<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pembayaran extends Model
{
    use HasFactory;
    // Data yang boleh diisi
    protected $fillable = [
        'siswa_id', 'jumlah_bayar', 'tanggal_bayar', 'bulan_bayar', 'tahun_bayar',
    ];

    // 1 Pembayaran PASTI dimiliki oleh 1 Siswa
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }
}