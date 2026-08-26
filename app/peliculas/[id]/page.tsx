import Link from 'next/link'
import { getMovieById, getImageUrl } from '@/lib/tmdb'

export default async function DetallePeliculaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  console.log("🔍 Buscando película con ID:", id);
  const pelicula = await getMovieById(id);
  console.log("📦 Datos recibidos:", pelicula ? "✅ SÍ llegó" : "❌ NULL");


  if (!pelicula) {
    return (
      <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Película no encontrada</h1>
          <p className="text-white/50 mb-4">ID buscado: {id}</p>
          <Link href="/" className="text-yellow-400 hover:underline">← Volver al catálogo</Link>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#07070A] text-white">
      <div className="px-6 md:px-10 pt-8 max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6">
          ← Volver al catálogo
        </Link>
      </div>

      <div className="px-6 md:px-10 pb-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[320px_1fr] gap-8">
          <div className="flex justify-center">
            <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={getImageUrl(pelicula.poster_path, "w500")}
                alt={pelicula.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="space-y-5">
            <h1 className="text-3xl font-black">{pelicula.title}</h1>

            {/* ✅ ESTE ES EL BOTÓN — Al hacer clic va a Iniciar Sesión */}
            <Link href="/login" className="inline-block px-5 py-2 rounded-full font-bold bg-gray-700 text-white hover:bg-gray-600 transition">
              🤍 Agregar a Favoritos
            </Link>

            {pelicula.tagline && <p className="text-lg text-white/60 italic">{pelicula.tagline}</p>}

            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-bold">
                ⭐ {pelicula.vote_average?.toFixed(1)}
              </span>
              <span className="px-3 py-1.5 bg-white/10 rounded-full text-sm">
                📅 {pelicula.release_date?.substring(0,4) || "N/A"}
              </span>
              <span className="px-3 py-1.5 bg-white/10 rounded-full text-sm">
                ⏱️ {pelicula.runtime} min
              </span>
            </div>

            {pelicula.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pelicula.genres.map((g:any) => (
                  <span key={g.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold mb-2">Sinopsis</h2>
              <p className="text-white/70 leading-relaxed">
                {pelicula.overview || "Sin sinopsis disponible."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}