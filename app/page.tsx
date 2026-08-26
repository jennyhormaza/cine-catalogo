import Link from 'next/link'
import { getPopularMovies, getImageUrl } from '@/lib/tmdb'

export default async function HomePage() {
  const peliculas = await getPopularMovies();

  return (
    <main className="min-h-screen bg-[#07070A] text-white">
      {/* HERO */}
      <section className="relative w-full h-[460px] flex items-center justify-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000')",
          }}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40"></div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl w-full">
          <h1 className="text-[32px] md:text-[40px] font-black text-white mb-2 leading-tight">
            Bienvenido al Catálogo de Películas
          </h1>
          <p className="text-white/80 text-[14px] md:text-[15px] mb-6">
            Explora, busca y guarda tus películas favoritas
          </p>
          
          {/* 🔍 Buscador */}
          <div className="max-w-[460px] mx-auto mb-5 relative">
            <Link href="/buscar" className="block w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <div className="w-full bg-[#121212] border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-[13px] text-white/40 hover:border-yellow-500/40 transition-colors">
                Buscar películas, géneros, directores...
              </div>
            </Link>
          </div>
          
          {/* ✅ Solo queda el botón de Explorar Películas */}
          <div className="flex gap-3 justify-center">
            <Link href="/peliculas" className="bg-[#FBBF24] hover:bg-[#F59E0B] text-black font-bold px-6 py-2.5 rounded-full text-[13px] transition">
              Explorar Películas
            </Link>
          </div>
        </div>
      </section>

      {/* TENDENCIAS */}
      <section className="relative px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.25em] mb-2">Lo más visto</p>
            <h2 className="text-3xl md:text-4xl font-black">
              Tendencias ahora
              <span className="ml-2">🔥</span>
            </h2>
          </div>
          <Link href="/peliculas" className="text-sm font-semibold text-white/50 hover:text-yellow-400 transition-colors duration-300">
            Ver catálogo completo →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {peliculas.length === 0 ? (
            <p className="col-span-full text-center text-white/50 py-10">
              Cargando películas...
            </p>
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="w-12 h-12 rounded-full bg-yellow-400 text-black flex items-center justify-center text-lg shadow-xl">▶</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm md:text-base truncate group-hover:text-yellow-400 transition-colors duration-300">
                      {peli.title || peli.name}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      {peli.release_date?.substring(0, 4) || "N/A"}
                    </p>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* SECCIÓN FINAL */}
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-yellow-400/10 via-white/[0.03] to-purple-500/10 p-8 md:p-12">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">Catálogo cinematográfico</p>
            <h2 className="text-3xl md:text-4xl font-black max-w-2xl leading-tight">
              Una película puede cambiar tu noche.
            </h2>
            <p className="text-white/50 mt-4 max-w-xl leading-relaxed">
              Encuentra historias, descubre nuevos géneros y crea tu propia colección de películas favoritas.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}