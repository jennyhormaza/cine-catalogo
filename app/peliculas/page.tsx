import Link from 'next/link'
import { getPopularMovies, getImageUrl } from '@/lib/tmdb'

export default async function CatalogoPage() {
  const peliculas = await getPopularMovies();

  return (
    <main className="min-h-screen bg-[#07070A] text-white px-6 md:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black mb-2">Catálogo de Películas</h1>
          <p className="text-white/50">Explora todas las películas disponibles en el catálogo.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {peliculas.length === 0 ? (
            <p className="col-span-full text-center text-white/50 py-16">Cargando películas...</p>
          ) : (
          peliculas.map((peli: any) => (
              <Link href={`/peliculas/${peli.id}`} key={peli.id} className="group">
                <article className="relative overflow-hidden rounded-2xl bg-[#111116] border border-white/5 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                  <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
                    <img
                      src={getImageUrl(peli.poster_path)}
                      alt={peli.title || peli.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-bold">
                      ⭐ {peli.vote_average?.toFixed(1) || "N/A"}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center text-xl shadow-xl">▶</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-xs font-bold rounded-full mb-2">
                      {peli.release_date?.substring(0, 4) || "N/A"}
                    </span>
                    <h3 className="font-bold text-lg truncate group-hover:text-yellow-400 transition-colors duration-300">
                      {peli.title || peli.name}
                    </h3>
                    <p className="text-sm text-white/40 mt-1 line-clamp-2">
                      {peli.overview || "Sin descripción"}
                    </p>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}