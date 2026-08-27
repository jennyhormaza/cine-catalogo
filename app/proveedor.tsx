'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { supabase } from '@/lib/supabase';

interface Usuario {
  nombre: string;
  email: string;
}

interface ContextoSesion {
  usuario: Usuario | null;
  favoritos: number[];
  cargandoSesion: boolean;
  iniciarSesion: (datos: Usuario) => void;
  cerrarSesion: () => void;
  alternarFavorito: (idPelicula: number) => void;
  esFavorito: (idPelicula: number) => boolean;
}

const Contexto = createContext<ContextoSesion | undefined>(undefined);

export function ProveedorSesion({
  children,
}: {
  children: ReactNode;
}) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // ==============================
  // CARGAR SESIÓN DE SUPABASE
  // ==============================

  useEffect(() => {
    let activo = true;

    const cargarSesion = async () => {
      try {
        const { data, error } =
          await supabase.auth.getSession();

        if (error) {
          console.error(
            'Error obteniendo sesión:',
            error
          );

          if (activo) {
            setUsuario(null);
            setCargandoSesion(false);
          }

          return;
        }

        if (data.session?.user) {
          const user = data.session.user;

          if (activo) {
            setUsuario({
              nombre:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0] ||
                'Usuario',

              email: user.email || '',
            });
          }
        } else {
          if (activo) {
            setUsuario(null);
          }
        }
      } catch (error) {
        console.error(
          'Error cargando sesión:',
          error
        );

        if (activo) {
          setUsuario(null);
        }
      } finally {
        if (activo) {
          setCargandoSesion(false);
        }
      }
    };

    cargarSesion();

    // ==============================
    // ESCUCHAR CAMBIOS DE SESIÓN
    // ==============================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!activo) return;

        if (session?.user) {
          const user = session.user;

          setUsuario({
            nombre:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split('@')[0] ||
              'Usuario',

            email: user.email || '',
          });
        } else {
          setUsuario(null);
        }

        setCargandoSesion(false);
      }
    );

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==============================
  // CARGAR FAVORITOS
  // ==============================

  useEffect(() => {
    try {
      const favoritosGuardados =
        localStorage.getItem('mis_favoritos');

      if (favoritosGuardados) {
        const datos = JSON.parse(
          favoritosGuardados
        );

        if (Array.isArray(datos)) {
          setFavoritos(
            datos.map(Number).filter(
              (id) => !Number.isNaN(id)
            )
          );
        }
      }
    } catch (error) {
      console.error(
        'Error cargando favoritos:',
        error
      );

      setFavoritos([]);
    }
  }, []);

  // ==============================
  // INICIAR SESIÓN
  // ==============================

  const iniciarSesion = (datos: Usuario) => {
    setUsuario(datos);
    setCargandoSesion(false);
  };

  // ==============================
  // CERRAR SESIÓN
  // ==============================

  const cerrarSesion = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        'Error al cerrar sesión:',
        error
      );

      return;
    }

    setUsuario(null);
  };

  // ==============================
  // AGREGAR / QUITAR FAVORITO
  // ==============================

  const alternarFavorito = (
    idPelicula: number
  ) => {
    if (!usuario) {
      return;
    }

    setFavoritos((prev) => {
      let nuevosFavoritos: number[];

      if (prev.includes(idPelicula)) {
        nuevosFavoritos = prev.filter(
          (id) => id !== idPelicula
        );
      } else {
        nuevosFavoritos = [
          ...prev,
          idPelicula,
        ];
      }

      localStorage.setItem(
        'mis_favoritos',
        JSON.stringify(nuevosFavoritos)
      );

      return nuevosFavoritos;
    });
  };

  // ==============================
  // COMPROBAR FAVORITO
  // ==============================

  const esFavorito = (
    idPelicula: number
  ) => {
    return favoritos.includes(idPelicula);
  };

  return (
    <Contexto.Provider
      value={{
        usuario,
        favoritos,
        cargandoSesion,
        iniciarSesion,
        cerrarSesion,
        alternarFavorito,
        esFavorito,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

// ==============================
// HOOK DE SESIÓN
// ==============================

export function useSesion() {
  const contexto = useContext(Contexto);

  if (!contexto) {
    throw new Error(
      'useSesion debe utilizarse dentro de ProveedorSesion'
    );
  }

  return contexto;
}