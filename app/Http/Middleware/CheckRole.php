<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Jika pengguna tidak login ATAU rolenya tidak ada di daftar $roles
        if (! $request->user() || ! in_array($request->user()->role, $roles)) {
            // Bisa juga redirect ke halaman lain
            abort(403, 'UNAUTHORIZED ACTION.'); 
        }

        return $next($request);
    }
}