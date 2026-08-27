'use client';

import { useSesion } from '@/app/proveedor';

export default function BotonFavorito({
  peliculaId,
}: {
  peliculaId: number;
}) {
  const {
    usuario,
    favoritos,
    alternarFavorito,
  } = useSesion();

  const esFavorito = favoritos.includes(peliculaId);

  async function manejarFavorito() {
    if (!usuario) {
      window.location.href = '/login';
      return;
    }

    await alternarFavorito(peliculaId);
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