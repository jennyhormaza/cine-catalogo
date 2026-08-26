'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  nombre: string;
  email: string;
}

interface ContextoSesion {
  usuario: Usuario | null;
  favoritos: number[];
  iniciarSesion: (datos: Usuario) => void;
  cerrarSesion: () => void;
  alternarFavorito: (idPelicula: number) => void;
  esFavorito: (idPelicula: number) => boolean;
}

const Contexto = createContext<ContextoSesion | undefined>(undefined);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<number[]>([]);

  // Cargar datos guardados al abrir la página
  useEffect(() => {
    const datosGuardados = localStorage.getItem('sesion_usuario');
    const favGuardados = localStorage.getItem('mis_favoritos');
    
    if (datosGuardados) setUsuario(JSON.parse(datosGuardados));
    if (favGuardados) setFavoritos(JSON.parse(favGuardados));
  }, []);

  // Guardar sesión
  const iniciarSesion = (datos: Usuario) => {
    setUsuario(datos);
    localStorage.setItem('sesion_usuario', JSON.stringify(datos));
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('sesion_usuario');
  };

  // Agregar / Quitar película de favoritos
  const alternarFavorito = (idPelicula: number) => {
    setFavoritos((prev: number[]) => {
      const nuevos = prev.includes(idPelicula)
        ? prev.filter((id) => id !== idPelicula) // ❌ Quitar
        : [...prev, idPelicula]; // ⭐ Agregar
      
      localStorage.setItem('mis_favoritos', JSON.stringify(nuevos));
      return nuevos;
    });
  };

  // Saber si una película está en favoritos
  const esFavorito = (idPelicula: number) => {
    return favoritos.includes(idPelicula);
  };

  return (
    <Contexto.Provider value={{
      usuario,
      favoritos,
      iniciarSesion,
      cerrarSesion,
      alternarFavorito,
      esFavorito
    }}>
      {children}
    </Contexto.Provider>
  );
}

// Función para usar estos datos en cualquier página
export function useSesion() {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("Falta el ProveedorSesion");
  return contexto;
}