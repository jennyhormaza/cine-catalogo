"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-xl font-bold text-yellow-400">CineCatálogo</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`transition-colors hover:text-yellow-400 ${
              pathname === "/" ? "text-yellow-400 font-semibold" : "text-gray-300"
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/peliculas"
            className={`transition-colors hover:text-yellow-400 ${
              pathname.startsWith("/peliculas") ? "text-yellow-400 font-semibold" : "text-gray-300"
            }`}
          >
            Catálogo
          </Link>
          <Link
            href="/favoritos"
            className={`transition-colors hover:text-yellow-400 ${
              pathname === "/favoritos" ? "text-yellow-400 font-semibold" : "text-gray-300"
            }`}
          >
            Favoritos
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition">
            Registrarse
          </button>
          
          {/* ✅ CORREGIDO: Era un <button> → ahora es <Link href="/login"> */}
          <Link 
            href="/login"
            className="hidden md:block bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3 flex gap-4">
        <Link href="/" className="text-gray-300 hover:text-yellow-400">Inicio</Link>
        <Link href="/peliculas" className="text-gray-300 hover:text-yellow-400">Catálogo</Link>
        <Link href="/favoritos" className="text-gray-300 hover:text-yellow-400">Favoritos</Link>
      </div>
    </nav>
  );
}