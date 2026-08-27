'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CrearPeliculaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    año: '',
    género: ''
  });
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [nombreImagen, setNombreImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  // ✅ ELIGE IMAGEN DESDE TU COMPUTADORA
  function alElegirImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (archivo) {
      setArchivoImagen(archivo);
      setNombreImagen(archivo.name);
    }
  }

  async function guardarPelicula(e: React.FormEvent) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('⚠️ Inicia sesión primero'); return; }

    setSubiendo(true);
    let rutaImagen = null;

    // ✅ SUBE LA IMAGEN A LA NUBE DE SUPABASE AUTOMÁTICAMENTE
    if (archivoImagen) {
      const nombreUnico = `${Date.now()}-${archivoImagen.name}`;
      const { error: errorSubida } = await supabase
        .storage
        .from('imagenes-peliculas')
        .upload(nombreUnico, archivoImagen);

      if (errorSubida) {
        console.error('❌ Error al subir:', errorSubida);
        alert('⚠️ No se pudo subir la imagen');
        setSubiendo(false);
        return;
      }

      // ✅ OBTIENE LA DIRECCIÓN PÚBLICA DE LA IMAGEN
      const { data: { publicUrl } } = supabase
        .storage
        .from('imagenes-peliculas')
        .getPublicUrl(nombreUnico);

      rutaImagen = publicUrl;
    }

    // ✅ GUARDA LA PELÍCULA CON LA DIRECCIÓN DE LA IMAGEN
    const { error } = await supabase.from('movies').insert([{
      titulo: form.titulo,
      descripcion: form.descripcion,
      "año": form.año ? parseInt(form.año) : null,
      "género": form.género,
      imagen: rutaImagen,
      user_id: user.id
    }]);

    setSubiendo(false);

    if (error) alert('❌ Error: ' + error.message);
    else { alert('✅ Película guardada'); router.push('/mis-peliculas-creadas'); }
  }

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">➕ Crear Película</h1>
        <form onSubmit={guardarPelicula} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Título *</label>
            <input 
              type="text" 
              required 
              value={form.titulo} 
              onChange={(e)=>setForm({...form,titulo:e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none" 
              placeholder="Nombre de la película"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Descripción</label>
            <textarea 
              value={form.descripcion} 
              onChange={(e)=>setForm({...form,descripcion:e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none" 
              rows={4} 
              placeholder="Breve descripción..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Año</label>
              <input 
                type="text" 
                value={form.año} 
                onChange={(e)=>setForm({...form,año:e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none" 
                placeholder="2026"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Género</label>
              <input 
                type="text" 
                value={form.género} 
                onChange={(e)=>setForm({...form,género:e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none" 
                placeholder="Acción / Comedia"
              />
            </div>
          </div>

          {/* ✅ BOTÓN PARA SELECCIONAR IMAGEN DESDE TU PC */}
          <div>
            <label className="block mb-2 font-semibold">Imagen</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <input 
                type="file" 
                accept="image/*" 
                id="elegir-imagen" 
                onChange={alElegirImagen} 
                className="hidden"
              />
              <label 
                htmlFor="elegir-imagen" 
                className="cursor-pointer inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg"
              >
                📁 SELECCIONAR IMAGEN
              </label>
              {nombreImagen && <p className="mt-3 text-green-400 font-bold">✅ Elegida: {nombreImagen}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={subiendo} 
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg text-lg mt-4 disabled:opacity-50"
          >
            {subiendo ? '⏳ Subiendo...' : '✅ Guardar Película'}
          </button>
        </form>
      </div>
    </main>
  );
}