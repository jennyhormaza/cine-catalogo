'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import BotonFavorito from '@/components/BotonFavorito';

type Pelicula = {
  id: string;
  titulo: string;
  descripcion: string;
  "año": number | null;
  "género": string;
  imagen: string | null;
};

export default function PeliculasCreadasPage() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPeliculas();
  }, []);

  async function cargarPeliculas() {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPeliculas(data || []);
    } catch (err) {
      console.error('❌ Error:', err);
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/" 
          className="text-yellow-400 mb-6 inline-block"
        >
          ← Regresar
        </Link>

        <h1 className="text-3xl font-bold mb-8">🎬 Películas Creadas por Admin</h1>

        {peliculas.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🎬</div>
            <h2 className="text-2xl font-bold mb-2">No hay películas todavía</h2>
            <p className="text-gray-400">El administrador pronto agregará películas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peliculas.map((p) => (
              <div key={p.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                
                {/* ✅ IMAGEN — EXACTAMENTE IGUAL QUE EN TU PÁGINA */}
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
                  
                  {/* ✅ BOTÓN DE FAVORITOS — TODOS PUEDEN GUARDAR */}
<BotonFavorito peliculaId={Number(p.id)} />                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}