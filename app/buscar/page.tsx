'use client'; // ← Necesitamos esto porque lee lo que escribe el usuario

import Link from 'next/link'
import { getImageUrl } from '@/lib/tmdb'
import { useState, useEffect } from 'react'

export default function BuscarPage() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  // Buscar cuando el usuario escribe (con pausa)
  useEffect(() => {
    const buscar = async () => {
      if (!busqueda.trim()) {
        setResultados([]);
        return;
      }

      setCargando(true);
      try {
        const respuesta = await fetch(`/api/buscar?q=${encodeURIComponent(busqueda)}`);
        const datos = await respuesta.json();
        setResultados(datos.resultados || []);
      } catch (err) {
        console.error("Error:", err);
        setResultados([]);
      }
      setCargando(false);
    };

    const temporizador = setTimeout(buscar, 500); // Espera 0.5s después de escribir
    return () => clearTimeout(temporizador);
  }, [busqueda]);

  return (
    <main className="min-h-screen bg-[#07070A] text-white px-6 md:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-black mb-8">🔍 Buscar Películas</h1>

        {/* Caja de búsqueda */}
        <div className="max-w-2xl mx-auto mb-10">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribe el nombre de una película..."
            className="w-full bg-[#121212] border border-white/10 rounded-full py-3 px-5 text-lg text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-500/50"
            autoFocus
          />
        </div>

        {/* Resultados */}
        {cargando ? (
          <p className="text-center text-white/50 py-10">🔎 Buscando...</p>
        ) : resultados.length === 0 && busqueda.trim() ? (
          <p className="text-center text-white/50 py-10">
            No se encontraron películas con "{busqueda}"
          </p>
        ) : resultados.length === 0 ? (
          <p className="text-center text-white/50 py-10">
            Escribe arriba para buscar películas 🎬
          </p>
        ) : (
          <>
            <p className="text-white/50 mb-6">
              Se encontraron <span className="text-yellow-400 font-bold">{resultados.length}</span> películas
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {resultados.map((peli) => (
                <Link href={`/peliculas/${peli.id}`} key={peli.id} className="group">
                  <article className="relative overflow-hidden rounded-2xl bg-[#111116] border border-white/5 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                    <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
                      <img
                        src={getImageUrl(peli.poster_path)}
                        alt={peli.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-bold">
                        ⭐ {peli.vote_average?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg truncate group-hover:text-yellow-400 transition-colors">
                        {peli.title}
                      </h3>
                      <p className="text-sm text-white/40 mt-1">
                        {peli.release_date?.substring(0, 4) || "N/A"}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}