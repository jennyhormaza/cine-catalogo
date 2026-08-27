import { NextResponse } from 'next/server'

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL =
  process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

export async function GET() {
  if (!API_KEY) {
    console.error('❌ TMDB_API_KEY no está disponible')
    return NextResponse.json(
      { results: [] },
      { status: 500 }
    )
  }

  try {
    const respuesta = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`,
      {
        next: {
          revalidate: 3600,
        },
      }
    )

    if (!respuesta.ok) {
      console.error(
        '❌ Error TMDB:',
        respuesta.status
      )

      return NextResponse.json(
        { results: [] },
        { status: respuesta.status }
      )
    }

    const datos = await respuesta.json()

    return NextResponse.json({
      results: datos.results || [],
    })

  } catch (error) {
    console.error(
      '🔥 Error obteniendo tendencias:',
      error
    )

    return NextResponse.json(
      { results: [] },
      { status: 500 }
    )
  }
}