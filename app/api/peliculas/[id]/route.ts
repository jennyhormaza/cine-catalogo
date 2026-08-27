import { NextResponse } from 'next/server';
import { getMovieById } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de película requerido' },
        { status: 400 }
      );
    }

    const pelicula = await getMovieById(id);

    if (!pelicula) {
      return NextResponse.json(
        { error: 'Película no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(pelicula);

  } catch (error) {
    console.error(
      '❌ Error en API de película:',
      error
    );

    return NextResponse.json(
      { error: 'Error obteniendo película' },
      { status: 500 }
    );
  }
}