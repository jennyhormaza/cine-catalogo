const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL =
  process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

console.log('🔑 Clave API:', API_KEY ? '✅ SÍ existe' : '❌ NO existe');

// ============================================
// OBTENER PELÍCULAS POPULARES
// ============================================

export async function getPopularMovies() {
  if (!API_KEY) {
    console.error('❌ Falta TMDB_API_KEY en .env.local');
    return [];
  }

  try {
    const respuesta = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!respuesta.ok) {
      console.error(
        '❌ Error TMDB películas populares:',
        respuesta.status
      );

      return [];
    }

    const datos = await respuesta.json();

    return datos.results || [];
  } catch (error) {
    console.error('🔥 Error obteniendo películas populares:', error);

    return [];
  }
}

// ============================================
// OBTENER UNA PELÍCULA POR ID
// ============================================

export async function getMovieById(id: string | number) {
  if (!API_KEY) {
    console.error('❌ Falta TMDB_API_KEY en .env.local');
    return null;
  }

  try {
    console.log('🔍 Buscando película con ID:', id);

    const respuesta = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!respuesta.ok) {
      console.error(
        '❌ Error buscando película:',
        respuesta.status
      );

      return null;
    }

    const pelicula = await respuesta.json();

    console.log('✅ Película encontrada:', pelicula.title);

    return pelicula;
  } catch (error) {
    console.error('🔥 Error obteniendo película:', error);

    return null;
  }
}

// ============================================
// URL DE IMÁGENES
// ============================================

export function getImageUrl(
  path: string | null | undefined,
  size: string = 'w500'
) {
  if (!path) {
    return '/placeholder.jpg';
  }

  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// ============================================
// BUSCAR PELÍCULAS
// ============================================

export async function searchMovies(query: string) {
  if (!API_KEY) {
    console.error('❌ Falta TMDB_API_KEY en .env.local');
    return [];
  }

  if (!query.trim()) {
    return [];
  }

  try {
    const respuesta = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(
        query
      )}&page=1&include_adult=false`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!respuesta.ok) {
      console.error(
        '❌ Error buscando películas:',
        respuesta.status
      );

      return [];
    }

    const datos = await respuesta.json();

    return datos.results || [];
  } catch (error) {
    console.error('🔥 Error buscando películas:', error);

    return [];
  }
}