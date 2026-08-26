import { searchMovies } from '@/lib/tmdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const consulta = searchParams.get("q") || "";

  const resultados = await searchMovies(consulta);
  return Response.json({ resultados });
}