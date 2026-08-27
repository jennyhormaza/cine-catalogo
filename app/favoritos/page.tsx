'use client';

import Link from 'next/link';
import { useSesion } from '@/app/proveedor';
import { getImageUrl } from '@/lib/tmdb';
import { useState, useEffect } from 'react';

export default function FavoritosPage() {
  const {
    usuario,
    favoritos,
    alternarFavorito,
  } = useSesion();

  const [peliculas, setPeliculas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFavoritos = async () => {
      if (favoritos.length === 0) {
        setPeliculas([]);
        setCargando(false);
        return;
      }

      setCargando(true);

      const resultados: any[] = [];

      for (const id of favoritos) {
        try {
          const respuesta = await fetch(
            `/api/peliculas/${id}`
          );

          if (!respuesta.ok) {
            console.error(
              `❌ Error cargando película ${id}`
            );
            continue;
          }

          const pelicula = await respuesta.json();

          if (pelicula) {
            resultados.push(pelicula);
          }
        } catch (error) {
          console.error(
            `❌ Error cargando película ${id}:`,
            error
          );
        }
      }

      setPeliculas(resultados);
      setCargando(false);
    };

    if (usuario) {
      cargarFavoritos();
    } else {
      setPeliculas([]);
      setCargando(false);
    }
  }, [favoritos, usuario]);

  // ==========================================
  // SIN SESIÓN
  // ==========================================

  if (!usuario) {
    return (
      <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-4">

        <div className="text-center max-w-md">

          <h1 className="text-3xl font-black mb-4">
            ⭐ Mis Favoritos
          </h1>

          <p className="text-white/60 mb-6">
            Debes iniciar sesión para ver y guardar tus películas favoritas.
          </p>

          <Link
            href="/login"
            className="inline-block bg-[#FBBF24] hover:bg-[#F59E0B] text-black font-bold px-6 py-2.5 rounded-full transition"
          >
            🔐 Iniciar Sesión
          </Link>

        </div>

      </main>
    );
  }

  // ==========================================
  // CON SESIÓN
  // ==========================================

  return (
    <main className="min-h-screen bg-[#07070A] text-white px-6 md:px-10 py-12">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-black mb-2">
          ⭐ Mis Favoritos
        </h1>

        <p className="text-white/60 mb-8">
          Hola,{' '}
          <span className="text-yellow-400 font-bold">
            {usuario.nombre}
          </span>{' '}
          — tienes {favoritos.length} película(s) guardadas
        </p>

        {cargando ? (

          <p className="text-center text-white/50 py-10">
            Cargando tus favoritos...
          </p>

        ) : peliculas.length === 0 ? (

          <div className="text-center py-16">

            <p className="text-6xl mb-4">
              🎬
            </p>

            <p className="text-white/50 text-lg mb-6">
              No tienes películas favoritas todavía.
            </p>

            <p className="text-white/40">
              Explora el catálogo y dale ❤️ a las que más te gusten.
            </p>

            <Link
              href="/peliculas"
              className="inline-block mt-6 bg-[#FBBF24] hover:bg-[#F59E0B] text-black font-bold px-6 py-2.5 rounded-full transition"
            >
              Explorar Películas
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {peliculas.map((peli) => (

              <article
                key={peli.id}
                className="relative overflow-hidden rounded-2xl bg-[#111116] border border-white/5 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50"
              >

                <Link
                  href={`/peliculas/${peli.id}`}
                  className="group block"
                >

                  <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">

                    <img
                      src={getImageUrl(
                        peli.poster_path
                      )}
                      alt={peli.title || 'Película'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-bold">
                      ⭐ {peli.vote_average?.toFixed(1) || 'N/A'}
                    </div>

                  </div>

                  <div className="p-4 pr-14">

                    <h3 className="font-bold text-sm md:text-base truncate group-hover:text-yellow-400 transition-colors">
                      {peli.title || 'Sin título'}
                    </h3>

                    <p className="text-xs text-white/40 mt-1">
                      {peli.release_date?.substring(0, 4) || 'N/A'}
                    </p>

                  </div>

                </Link>

                {/* QUITAR DE FAVORITOS */}

                <button
                  type="button"
                  onClick={() =>
                    alternarFavorito(Number(peli.id))
                  }
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-red-500/20 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
                  title="Quitar de favoritos"
                >
                  ❤️
                </button>

              </article>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}