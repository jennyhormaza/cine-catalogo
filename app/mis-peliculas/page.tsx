'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Pelicula = {
  id: string;
  titulo: string;
  descripcion: string;
  "año": number | null;
  "género": string | null;
  imagen: string | null;
  user_id: string;
};

export default function MisPeliculasPage() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    verificarSesion();
  }, []);

  // ✅ PROTECCIÓN: Si no hay sesión → mandar a Login
  const verificarSesion = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    cargarPeliculas();
  };

  const cargarPeliculas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // ✅ SOLO TUS PELÍCULAS: filtra por tu user_id
    const { data } = await supabase
      .from('movies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setPeliculas(data || []);
    setCargando(false);
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta película?')) return;
    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (error) alert('❌ No se pudo eliminar: ' + error.message);
    cargarPeliculas();
  };

  if (cargando) return <p className="p-10">Cargando...</p>;

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🎬 Mis Películas</h1>
          <Link
            href="/nueva-pelicula"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg transition"
          >
            + Agregar Película
          </Link>
        </div>

        {peliculas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-4">No has agregado ninguna película</p>
            <Link
              href="/nueva-pelicula"
              className="inline-block bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg"
            >
              Agregar la primera 🎬
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peliculas.map((p) => (
              <div key={p.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                {/* ✅ IMAGEN: usa el nombre correcto "imagen" NO "imagen_url" */}
                {p.imagen ? (
                  <img src={p.imagen} alt={p.titulo} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-4xl">🎬</div>
                )}

                <div className="p-4">
                  <h3 className="font-bold text-lg">{p.titulo}</h3>
                  <p className="text-sm text-gray-400">
                    {p.año} {p.género && `• ${p.género}`}
                  </p>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">{p.descripcion}</p>

                  {/* ✅ BOTONES: Editar y Eliminar SOLO aparecen aquí en TUS películas */}
                  <div className="mt-3 flex gap-3">
                    <Link
                      href={`/editar-pelicula/${p.id}`}
                      className="text-blue-400 text-sm hover:text-blue-300"
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => eliminar(p.id)}
                      className="text-red-400 text-sm hover:text-red-300"
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