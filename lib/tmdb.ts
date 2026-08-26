const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

console.log("🔑 Clave API:", API_KEY ? "✅ SÍ existe" : "❌ NO existe");

// Obtener películas populares / tendencias
export async function getPopularMovies() {
  if (!API_KEY) {
    console.error("⚠️ Falta TMDB_API_KEY");
    return [];
  }

  try {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Error al cargar películas");
    const data = await res.json();
    return data.results.slice(0, 8);
  } catch (error) {
    console.error("Error TMDB:", error);
    return [];
  }
}

// Construir URL de la imagen
export function getImageUrl(path: string, size: string = "w500") {
  if (!path) return "https://via.placeholder.com/300x450?text=Sin+Imagen";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Obtener detalles de UNA sola película por su ID
export async function getMovieById(id: string | number) {
  if (!API_KEY) {
    console.error("⚠️ Falta TMDB_API_KEY");
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Película no encontrada");
    return await res.json();
  } catch (error) {
    console.error("Error al cargar película:", error);
    return null;
  }
}

// 🔍 Buscar películas por nombre
export async function searchMovies(query: string) {
  if (!API_KEY || !query.trim()) {
    return [];
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1`
    );

    if (!res.ok) throw new Error("Error en la búsqueda");
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Error búsqueda:", error);
    return [];
  }
}