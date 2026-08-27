'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    obtenerSesion()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function obtenerSesion() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    setUsuario(session?.user ?? null)
  }

  async function cerrarSesion() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error al cerrar sesión:', error)
      return
    }

    setUsuario(null)
  }

  // INICIALES DEL USUARIO
  const obtenerIniciales = () => {
    if (!usuario) return ''

    const nombre =
      usuario.user_metadata?.full_name ||
      usuario.user_metadata?.name ||
      usuario.email?.split('@')[0] ||
      'Usuario'

    const palabras = nombre.trim().split(/\s+/)

    if (palabras.length >= 2) {
      return (
        palabras[0].charAt(0) +
        palabras[1].charAt(0)
      ).toUpperCase()
    }

    return nombre.substring(0, 2).toUpperCase()
  }

  return (
    <nav className="w-full bg-[#09090D] border-b border-white/10">
      <div className="max-w-7xl mx-auto h-16 px-6 md:px-10 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-black text-lg hover:text-yellow-400 transition"
        >
          <span className="text-xl">🎬</span>
          <span>CineCatálogo</span>
        </Link>

        {/* 🔴 SIN SESIÓN */}
        {!usuario && (
          <Link
            href="/"
            className="text-sm font-bold text-white/80 hover:text-yellow-400 transition"
          >
            INICIO
          </Link>
        )}

        {/* 🟢 CON SESIÓN */}
        {usuario && (
          <div className="flex items-center gap-5">

            <span className="flex items-center gap-2 text-sm text-white/80">

              <span className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center">
                {obtenerIniciales()}
              </span>

            </span>

            <button
              onClick={cerrarSesion}
              className="text-sm font-bold text-red-400 hover:text-red-300 transition"
            >
              Cerrar sesión
            </button>

          </div>
        )}

      </div>
    </nav>
  )
}