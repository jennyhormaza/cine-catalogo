'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getImageUrl } from '@/lib/tmdb'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [peliculas, setPeliculas] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarUsuario()
  }, [])

  async function cargarUsuario() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUsuario(session?.user ?? null)
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
    } finally {
      setCargando(false)
    }
  }

  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#07070A] text-white">
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">
              🎬
            </div>

            <p className="text-white/50">
              Cargando...
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#07070A] text-white">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative w-full min-h-[460px] flex items-center justify-center overflow-hidden bg-black">

        {/* FONDO */}

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000')",
          }}
        />

        {/* OSCURECER */}

        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />

        {/* DEGRADADO */}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

        {/* CONTENIDO */}

        <div className="relative z-10 text-center px-6 max-w-5xl">

          <p className="text-yellow-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4">
            🎬 CineCatálogo
          </p>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
            Bienvenido al Catálogo de Películas
          </h1>

          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-9">
            Explora películas, descubre nuevas historias y encuentra
            tus favoritas en un solo lugar.
          </p>

          {/* =================================================
              SIN SESIÓN
          ================================================== */}

          {!usuario && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">

              <Link
                href="/register"
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-full transition"
              >
                Crear cuenta
              </Link>

              <Link
                href="/login"
                className="border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full transition"
              >
                Iniciar sesión
              </Link>

            </div>
          )}

          {/* =================================================
              CON SESIÓN
          ================================================== */}

          {usuario && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

              {/* BUSCADOR */}

              <form
                action="/peliculas"
                method="GET"
                className="flex w-full sm:w-[340px]"
              >

                <input
                  type="text"
                  name="buscar"
                  placeholder="🔍 Buscar películas..."
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-3 rounded-l-full outline-none focus:border-yellow-400 focus:bg-white/15 transition"
                />

                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-3 rounded-r-full transition"
                >
                  Buscar
                </button>

              </form>

              {/* CATÁLOGO */}

              <Link
                href="/peliculas"
                className="border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3 rounded-full transition whitespace-nowrap"
              >
                🎬 Catálogo
              </Link>

              {/* FAVORITOS */}

              <Link
                href="/favoritos"
                className="border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3 rounded-full transition whitespace-nowrap"
              >
                ⭐ Favoritos
              </Link>

            </div>
          )}

        </div>

      </section>

      {/* =====================================================
          TENDENCIAS
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        <div className="mb-8">

          <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            Lo más visto
          </p>

          <h2 className="text-3xl md:text-4xl font-black">
            Tendencias ahora 🔥
          </h2>

          <p className="text-white/40 mt-2">
            Algunas de las películas más populares del momento.
          </p>

        </div>

        {/* =================================================
            AQUÍ CARGAMOS LAS TENDENCIAS DESDE UNA API
        ================================================= */}

        <Tendencias />

      </section>

      {/* =====================================================
          INFORMACIÓN FINAL
      ====================================================== */}

      <section className="px-6 md:px-10 pb-20">

        <div className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12">

          <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">
            CineCatálogo
          </p>

          <h2 className="text-3xl md:text-4xl font-black max-w-2xl">
            Todo el cine que quieres descubrir.
          </h2>

          <p className="text-white/50 mt-4 max-w-2xl leading-relaxed">
            Explora nuestro catálogo de películas, encuentra nuevas
            historias y guarda tus películas favoritas para volver a
            ellas cuando quieras.
          </p>

        </div>

      </section>

    </main>
  )
}


// =====================================================
// COMPONENTE TENDENCIAS
// =====================================================

function Tendencias() {
  const [peliculas, setPeliculas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarTendencias()
  }, [])

  async function cargarTendencias() {
    try {
      const respuesta = await fetch('/api/tendencias')

      if (!respuesta.ok) {
        throw new Error('Error obteniendo tendencias')
      }

      const datos = await respuesta.json()

      setPeliculas(datos.slice(0, 6))
    } catch (error) {
      console.error(
        '❌ Error cargando tendencias:',
        error
      )

      setPeliculas([])
    } finally {
      setCargando(false)
    }
  }

  if (cargando) {
    return (
      <div className="py-12 text-center">
        <div className="text-4xl mb-4">
          🎬
        </div>

        <p className="text-white/50">
          Cargando tendencias...
        </p>
      </div>
    )
  }

  if (peliculas.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-5xl mb-4">
          🎬
        </div>

        <p className="text-white/50">
          No se pudieron cargar las películas.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">

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

              {/* CALIFICACIÓN */}

              <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded-lg text-[11px] font-bold">
                ⭐{' '}
                {peli.vote_average?.toFixed(1) ||
                  'N/A'}
              </div>

            </div>

            {/* INFORMACIÓN */}

            <div className="p-3">

              <h3 className="font-bold text-sm truncate group-hover:text-yellow-400 transition">
                {peli.title ||
                  'Sin título'}
              </h3>

              <p className="text-xs text-white/40 mt-1">
                {peli.release_date
                  ? peli.release_date.substring(0, 4)
                  : 'N/A'}
              </p>

            </div>

          </article>

        </Link>

      ))}

    </div>
  )
}