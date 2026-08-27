import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ProveedorSesion } from './proveedor'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CineCatálogo',
  description: 'Explora, busca y guarda tus películas favoritas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-[#0A0A0A] text-gray-100 min-h-screen flex flex-col`}
      >
        <ProveedorSesion>

          {/* NAVBAR GLOBAL */}
          <Navbar />

          {/* CONTENIDO */}
          <main className="flex-grow">
            {children}
          </main>

          {/* FOOTER GLOBAL */}
          <Footer />

        </ProveedorSesion>
      </body>
    </html>
  )
}