import Link from 'next/link'
import {
  getMovies,
  searchMovies,
  getImageUrl,
} from '@/lib/tmdb'

export default async function PeliculasPage({
  searchParams,
}: {
  searchParams: Promise<{
    buscar?: string
    page?: string
  }>
}) {
  const params = await searchParams

  const buscar = params.buscar?.trim() || ''

  const paginaActual = Math.max(
    1,
    Number(params.page) || 1
  )

  // ==========================================
  // OBTENER PELÍCULAS
  // ==========================================

  let datos

  if (buscar) {
    datos = await searchMovies(
      buscar,
      paginaActual
    )
  } else {
    datos = await getMovies(
      paginaActual
    )
  }

  const peliculas = datos.results || []

  // TMDB permite muchas páginas.
  // Limitamos a 500 por seguridad.
  const totalPaginas = Math.min(
    datos.total_pages || 1,
    500
  )

  return (
    <main className="min-h-screen bg-[#07070A] text-white">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-12">

        <div className="mb-8">

          <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            🎬 CineCatálogo
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            {buscar
              ? `Resultados para "${buscar}"`
              : 'Catálogo de Películas'}
          </h1>

          <p className="text-white/50 mt-3">
            {buscar
              ? 'Películas encontradas para tu búsqueda.'
              : 'Explora todas las películas disponibles en nuestro catálogo.'}
          </p>

        </div>


        {/* ==========================================
            BUSCADOR
        ========================================== */}

        <form
          action="/peliculas"
          method="GET"
          className="flex w-full max-w-2xl mb-12"
        >

          <input
            type="text"
            name="buscar"
            defaultValue={buscar}
            placeholder="🔍 Buscar una película..."
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-3.5 rounded-l-full outline-none focus:border-yellow-400 transition"
          />

          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-7 py-3.5 rounded-r-full transition"
          >
            Buscar
          </button>

        </form>

      </section>


      {/* ==========================================
          CATÁLOGO
      ========================================== */}

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">

        {peliculas.length === 0 ? (

          <div className="py-20 text-center">

            <div className="text-6xl mb-5">
              🎬
            </div>

            <h2 className="text-2xl font-bold mb-3">
              No encontramos películas
            </h2>

            <p className="text-white/50">
              Intenta buscar con otro nombre.
            </p>

          </div>

        ) : (

          <>

            {/* ======================================
                INFORMACIÓN DE PÁGINA
            ====================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

              <p className="text-white/40 text-sm">
                Página {paginaActual} de {totalPaginas}
              </p>

              {buscar && (
                <p className="text-yellow-400/70 text-sm">
                  🔎 Búsqueda: {buscar}
                </p>
              )}

            </div>


            {/* ======================================
                PELÍCULAS
            ====================================== */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

              {peliculas.map((peli: any) => (

                <Link
                  href={`/peliculas/${peli.id}`}
                  key={peli.id}
                  className="group"
                >

                  <article className="overflow-hidden rounded-2xl bg-[#111116] border border-white/5 hover:border-yellow-400/30 hover:-translate-y-2 transition-all duration-500">


                    {/* POSTER */}

                    <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">

                      <img
                        src={getImageUrl(
                          peli.poster_path,
                          'w500'
                        )}
                        alt={
                          peli.title ||
                          'Película'
                        }
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />


                      {/* DEGRADADO */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />


                      {/* CALIFICACIÓN */}

                      <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded-lg text-[11px] font-bold">

                        ⭐{' '}

                        {peli.vote_average
                          ? peli.vote_average.toFixed(1)
                          : 'N/A'}

                      </div>

                    </div>


                    {/* INFORMACIÓN */}

                    <div className="p-3">

                      <h2 className="font-bold text-sm truncate group-hover:text-yellow-400 transition">

                        {peli.title ||
                          peli.name ||
                          'Sin título'}

                      </h2>


                      <p className="text-xs text-white/40 mt-1">

                        {peli.release_date
                          ? peli.release_date.substring(
                              0,
                              4
                            )
                          : 'N/A'}

                      </p>

                    </div>

                  </article>

                </Link>

              ))}

            </div>


            {/* ======================================
                PAGINACIÓN
            ====================================== */}

            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">


              {/* ANTERIOR */}

              {paginaActual > 1 && (

                <Link
                  href={
                    buscar
                      ? `/peliculas?buscar=${encodeURIComponent(
                          buscar
                        )}&page=${paginaActual - 1}`
                      : `/peliculas?page=${paginaActual - 1}`
                  }
                  className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition font-bold"
                >
                  ← Anterior
                </Link>

              )}


              {/* PÁGINA ACTUAL */}

              <span className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-black">
                {paginaActual}
              </span>


              {/* SIGUIENTE */}

              {paginaActual < totalPaginas && (

                <Link
                  href={
                    buscar
                      ? `/peliculas?buscar=${encodeURIComponent(
                          buscar
                        )}&page=${paginaActual + 1}`
                      : `/peliculas?page=${paginaActual + 1}`
                  }
                  className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition font-bold"
                >
                  Siguiente →
                </Link>

              )}

            </div>

          </>

        )}

      </section>

    </main>
  )
}