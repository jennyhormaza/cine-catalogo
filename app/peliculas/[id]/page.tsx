import Link from 'next/link';
import { getMovieById, getImageUrl } from '@/lib/tmdb';
import BotonFavorito from '@/components/BotonFavorito';

export default async function DetallePeliculaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log('🔍 Buscando película con ID:', id);

  const pelicula = await getMovieById(id);

  console.log(
    '📦 Datos recibidos:',
    pelicula ? '✅ SÍ llegó' : '❌ NULL'
  );

  if (!pelicula) {
    return (
      <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-6">
        <div className="text-center">

          <div className="text-6xl mb-6">
            🎬
          </div>

          <h1 className="text-2xl font-bold mb-4">
            Película no encontrada
          </h1>

          <p className="text-white/50 mb-6">
            No pudimos encontrar la película con ID: {id}
          </p>

          <Link
            href="/peliculas"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl transition"
          >
            ← Volver al catálogo
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070A] text-white">

      {/* VOLVER AL CATÁLOGO */}
      <div className="px-6 md:px-10 pt-8 max-w-6xl mx-auto">

        <Link
          href="/peliculas"
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
        >
          ← Volver al catálogo
        </Link>

      </div>

      {/* CONTENIDO */}
      <div className="px-6 md:px-10 py-10 pb-16 max-w-6xl mx-auto">

        <div className="grid md:grid-cols-[320px_1fr] gap-10">

          {/* POSTER */}
          <div className="flex justify-center">

            <div className="w-full max-w-[300px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#111116]">

              <img
                src={getImageUrl(
                  pelicula.poster_path,
                  'w500'
                )}
                alt={pelicula.title || 'Película'}
                className="w-full h-auto object-cover"
              />

            </div>

          </div>

          {/* INFORMACIÓN */}
          <div className="space-y-6">

            {/* TÍTULO */}
            <div>

              <h1 className="text-3xl md:text-5xl font-black leading-tight">
                {pelicula.title}
              </h1>

              {pelicula.tagline && (
                <p className="text-lg text-white/50 italic mt-3">
                  {pelicula.tagline}
                </p>
              )}

            </div>

            {/* FAVORITOS */}
            <BotonFavorito
              peliculaId={Number(pelicula.id)}
            />

            {/* INFORMACIÓN PRINCIPAL */}
            <div className="flex flex-wrap gap-3">

              <span className="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-bold">
                ⭐ {pelicula.vote_average?.toFixed(1) || 'N/A'}
              </span>

              <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                📅 {pelicula.release_date?.substring(0, 4) || 'N/A'}
              </span>

              <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                ⏱️ {pelicula.runtime || 'N/A'} min
              </span>

            </div>

            {/* GÉNEROS */}
            {pelicula.genres &&
              pelicula.genres.length > 0 && (

              <div className="flex flex-wrap gap-2">

                {pelicula.genres.map(
                  (genero: {
                    id: number;
                    name: string;
                  }) => (

                    <span
                      key={genero.id}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70"
                    >
                      {genero.name}
                    </span>

                  )
                )}

              </div>

            )}

            {/* SINOPSIS */}
            <div>

              <h2 className="text-xl font-bold mb-3">
                Sinopsis
              </h2>

              <p className="text-white/70 leading-relaxed">
                {pelicula.overview ||
                  'Sin sinopsis disponible.'}
              </p>

            </div>

            {/* INFORMACIÓN EXTRA */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                <p className="text-white/40 text-sm mb-1">
                  Idioma original
                </p>

                <p className="font-bold">
                  {pelicula.original_language?.toUpperCase() ||
                    'N/A'}
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                <p className="text-white/40 text-sm mb-1">
                  Popularidad
                </p>

                <p className="font-bold">
                  {pelicula.popularity?.toFixed(0) || 'N/A'}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}