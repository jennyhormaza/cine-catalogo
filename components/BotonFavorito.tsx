'use client';
import { useSesion } from '@/app/proveedor';

export default function BotonFavorito({
  peliculaId,
}: {
  peliculaId: number | string; // ✅ ACEPTA NÚMERO Y TEXTO
}) {
  const {
    usuario,
    favoritos,
    alternarFavorito,
  } = useSesion();

  // ✅ COMPARAMOS COMO TEXTO PARA QUE NO FALLE
  const idTexto = String(peliculaId);
  const esFavorito = favoritos.some(id => String(id) === idTexto);

  async function manejarFavorito() {
    // ✅ Si NO hay sesión → llevar a iniciar sesión
    if (!usuario) {
      window.location.href = '/login';
      return;
    }
    // ✅ Enviamos SIEMPRE COMO TEXTO para que guarde TODO tipo de ID
    await alternarFavorito(idTexto as any);
  }

  return (
    <button
      type="button"
      onClick={manejarFavorito}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition ${
        esFavorito
          ? 'bg-red-500 text-white hover:bg-red-400'
          : 'bg-yellow-400 text-black hover:bg-yellow-300'
      }`}
    >
      {esFavorito
        ? '❤️ Quitar de Favoritos'
        : '🤍 Agregar a Favoritos'}
    </button>
  );
}