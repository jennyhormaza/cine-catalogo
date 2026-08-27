import { getTrendingMovies } from '@/lib/tmdb'

export async function GET() {
  try {
    const peliculas = await getTrendingMovies()

    return Response.json(peliculas)
  } catch (error) {
    console.error(
      '❌ Error en API de tendencias:',
      error
    )

    return Response.json(
      [],
      { status: 500 }
    )
  }
}