<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    use HasFactory;
    // Data yang boleh diisi
    protected $fillable = [
        'nama_lengkap', 'kelas', 'alamat', 'nama_wali', 'no_telp_wali',
    ];

    // 1 Siswa punya BANYAK data pembayaran
    public function pembayaran(): HasMany
    {
        return $this->hasMany(Pembayaran::class);
    }
}