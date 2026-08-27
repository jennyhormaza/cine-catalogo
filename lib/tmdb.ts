const API_KEY = process.env.TMDB_API_KEY;

const BASE_URL =
  process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

console.log(
  '🔑 Clave API:',
  API_KEY ? '✅ SÍ existe' : '❌ NO existe'
);


// ============================================
// PELÍCULAS EN TENDENCIA
// ============================================

export async function getTrendingMovies() {
  if (!API_KEY) {
    console.error('❌ Falta TMDB_API_KEY en .env.local');
    return [];
  }

  try {
    const respuesta = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!respuesta.ok) {
      console.error(
        '❌ Error obteniendo tendencias:',
        respuesta.status
      );

      return [];
    }

    const datos = await respuesta.json();

    console.log(
      '🔥 Tendencias encontradas:',
      datos.results?.length || 0
    );

    return datos.results || [];

  } catch (error) {
    console.error(
      '🔥 Error obteniendo películas en tendencia:',
      error
    );

    return [];
  }
}


// ============================================
// PELÍCULAS POPULARES
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
    console.error(
      '🔥 Error obteniendo películas populares:',
      error
    );

    return [];
  }
}


// ============================================
// CATÁLOGO DE PELÍCULAS
// ============================================

export async function getMovies(page: number = 1) {
  if (!API_KEY) {
    console.error('❌ Falta TMDB_API_KEY en .env.local');

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  try {
    const pagina = Math.max(1, page);

    const respuesta = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&page=${pagina}&include_adult=false`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!respuesta.ok) {
      console.error(
        '❌ Error obteniendo catálogo:',
        respuesta.status
      );

      return {
        results: [],
        total_pages: 0,
        total_results: 0,
      };
    }

    const datos = await respuesta.json();

    return {
      results: datos.results || [],
      total_pages: datos.total_pages || 0,
      total_results: datos.total_results || 0,
    };

  } catch (error) {
    console.error(
      '🔥 Error obteniendo catálogo:',
      error
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}


// ============================================
// UNA PELÍCULA POR ID
// ============================================

export async function getMovieById(
  id: string | number
) {
  if (!API_KEY) {
    console.error('❌ Falta TMDB_API_KEY en .env.local');
    return null;
  }

  try {
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

    return pelicula;

  } catch (error) {
    console.error(
      '🔥 Error obteniendo película:',
      error
    );

    return null;
  }
}


// ============================================
// IMÁGENES
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

export async function searchMovies(
  query: string,
  page: number = 1
) {
  if (!API_KEY) {
    console.error('❌ Falta TMDB_API_KEY en .env.local');

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  if (!query.trim()) {
    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  try {
    const pagina = Math.max(1, page);

    const respuesta = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(
        query
      )}&page=${pagina}&include_adult=false`,
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

      return {
        results: [],
        total_pages: 0,
        total_results: 0,
      };
    }

    const datos = await respuesta.json();

    return {
      results: datos.results || [],
      total_pages: datos.total_pages || 0,
      total_results: datos.total_results || 0,
    };

  } catch (error) {
    console.error(
      '🔥 Error buscando películas:',
      error
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}