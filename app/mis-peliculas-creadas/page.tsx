'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type PeliculaCreada = {
  id: string;
  titulo: string;
  descripcion: string;
  "año": number | null;
  "género": string;
  imagen: string | null;
};

export default function MisPeliculasCreadasPage() {
  const [peliculas, setPeliculas] = useState<PeliculaCreada[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    verificarSesion();
  }, []);

  async function verificarSesion() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    cargarMisPeliculas();
  }

  async function cargarMisPeliculas() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error:', error);
    } else {
      setPeliculas(data || []);
    }
    setCargando(false);
  }

  async function eliminarPelicula(id: string) {
    if (!confirm('¿Seguro que quieres ELIMINAR esta película?')) return;
    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (error) alert('❌ No se pudo eliminar');
    else { alert('✅ Película eliminada'); cargarMisPeliculas(); }
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#07070A] text-white p-6 md:p-10">
        <div className="text-center py-20">
          <p className="text-xl">Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📂 Mis Películas Creadas</h1>
            <p className="text-gray-400 mt-1">Tus películas — {peliculas.length} en total</p>
          </div>
          <Link 
            href="/" 
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-5 py-2 rounded-lg transition flex items-center gap-2"
          >
            ← Regresar
          </Link>
        </div>

        {peliculas.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🎬</div>
            <h2 className="text-2xl font-bold mb-2">Aún no has creado ninguna película</h2>
            <p className="text-gray-400">No hay películas para mostrar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peliculas.map((p) => (
              <div key={p.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                
                {/* ✅ IMAGEN DESDE LA NUBE — LA VE TODO EL MUNDO */}
                {p.imagen && p.imagen.startsWith('http') ? (
                  <img 
                    src={p.imagen} 
                    alt={p.titulo} 
                    className="w-full h-52 object-cover"
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-800 flex items-center justify-center text-5xl">🎬</div>
                )}

                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">{p.titulo}</h3>
                  <p className="text-sm text-yellow-400 mb-3">
                    {p["año"]} {p["género"] && `• ${p["género"]}`}
                  </p>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-5">
                    {p.descripcion || 'Sin descripción'}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href={`/editar-pelicula/${p.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition text-center block"
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => eliminarPelicula(p.id)}
                      className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold py-2 rounded-lg transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}