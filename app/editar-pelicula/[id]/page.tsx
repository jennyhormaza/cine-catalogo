'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function EditarPeliculaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [idPelicula, setIdPelicula] = useState('');
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    año: '',
    género: ''
  });
  const [imagenActualUrl, setImagenActualUrl] = useState<string | null>(null);
  const [archivoNuevo, setArchivoNuevo] = useState<File | null>(null);
  const [nombreImagen, setNombreImagen] = useState('');
  const [cargando, setCargando] = useState(true);

  function alElegirImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const seleccionado = e.target.files?.[0];
    if (seleccionado) {
      setArchivoNuevo(seleccionado);
      setNombreImagen(seleccionado.name);
    }
  }

  useEffect(() => {
    async function cargar() {
      const { id } = await params;
      setIdPelicula(id);
      await cargarDatosPelicula(id);
    }
    cargar();
  }, [params]);

  async function cargarDatosPelicula(id: string) {
    // ✅ OBTENEMOS EL USUARIO PRIMERO, ANTES DE COMPARAR
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('⚠️ Inicia sesión primero');
      router.push('/mis-peliculas-creadas');
      return;
    }

    // ✅ BUSCAMOS LA PELÍCULA
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      alert('❌ No se encontró la película');
      router.push('/mis-peliculas-creadas');
      return;
    }

    // ✅ AHORA SÍ COMPARAMOS — YA TENEMOS LOS DOS DATOS
    if (data.user_id !== user.id) {
      alert('❌ No tienes permiso para editar esta película');
      router.push('/mis-peliculas-creadas');
      return;
    }

    // ✅ TODO BIEN → CARGAMOS LOS DATOS
    setForm({
      titulo: data.titulo || '',
      descripcion: data.descripcion || '',
      año: data["año"]?.toString() || '',
      género: data["género"] || ''
    });
    setImagenActualUrl(data.imagen || null);
    setNombreImagen(data.imagen ? 'Imagen actual' : 'Sin imagen');
    setCargando(false);
  }

  async function guardarCambios(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('⚠️ Inicia sesión'); return; }

    let imagenFinal = imagenActualUrl;
    if (archivoNuevo) {
      const nombreUnico = `${Date.now()}-${archivoNuevo.name}`;
      const { error: errorSubida } = await supabase
        .storage
        .from('imagenes-peliculas')
        .upload(nombreUnico, archivoNuevo);

      if (errorSubida) {
        alert('⚠️ No se pudo subir la imagen');
        return;
      }
      const { data: { publicUrl } } = supabase
        .storage
        .from('imagenes-peliculas')
        .getPublicUrl(nombreUnico);
      imagenFinal = publicUrl;
    }

    const { error } = await supabase
      .from('movies')
      .update({
        titulo: form.titulo,
        descripcion: form.descripcion,
        "año": form.año ? parseInt(form.año) : null,
        "género": form.género,
        imagen: imagenFinal
      })
      .eq('id', idPelicula)
      .eq('user_id', user.id);

    if (error) {
      alert('❌ Error: ' + error.message);
    } else {
      alert('✅ Película actualizada');
      router.push('/mis-peliculas-creadas');
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">✏️ Editar Película</h1>
        <form onSubmit={guardarCambios} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Título *</label>
            <input
              type="text"
              required
              value={form.titulo}
              onChange={(e) => setForm({...form, titulo: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({...form, descripcion: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Año</label>
              <input
                type="text"
                value={form.año}
                onChange={(e) => setForm({...form, año: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Género</label>
              <input
                type="text"
                value={form.género}
                onChange={(e) => setForm({...form, género: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Imagen</label>
            {imagenActualUrl && (
              <div className="mb-3">
                <img src={imagenActualUrl} alt="Actual" className="w-full h-40 object-cover rounded-lg" />
              </div>
            )}
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                id="cambiar-imagen"
                onChange={alElegirImagen}
                className="hidden"
              />
              <label
                htmlFor="cambiar-imagen"
                className="cursor-pointer inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg"
              >
                📁 {imagenActualUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              </label>
              {nombreImagen && (
                <p className="mt-3 text-green-400 font-bold">✅ {archivoNuevo ? nombreImagen : 'Imagen actual'}</p>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.push('/mis-peliculas-creadas')}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg"
            >
              ← Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg"
            >
              ✅ Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}