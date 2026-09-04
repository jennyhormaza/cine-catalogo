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
  favoritos: (number | string)[]; // ✅ ACEPTA NÚMERO Y TEXTO
  cargandoSesion: boolean;
  iniciarSesion: (datos: Usuario) => void;
  cerrarSesion: () => void;
  alternarFavorito: (idPelicula: number | string) => Promise<void>; // ✅ AMBOS TIPOS
  esFavorito: (idPelicula: number | string) => boolean; // ✅ AMBOS TIPOS
}

const Contexto = createContext<ContextoSesion | undefined>(undefined);

export function ProveedorSesion({
  children,
}: {
  children: ReactNode;
}) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<(number | string)[]>([]); // ✅ AMBOS
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // ==============================
  // CARGAR SESIÓN + FAVORITOS DE SUPABASE
  // ==============================
  useEffect(() => {
    let activo = true;
    const cargarTodo = async () => {
      try {
        // 1. CARGAR SESIÓN
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error obteniendo sesión:', error);
          if (activo) {
            setUsuario(null);
            setFavoritos([]);
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

          // ✅ 2. CARGAR SOLO LOS FAVORITOS DE ESTE USUARIO
          const { data: datosFavoritos } = await supabase
            .from('favoritos')
            .select('pelicula_id')
            .eq('user_id', user.id); // 🔒 SOLO LOS SUYOS

          if (datosFavoritos) {
            setFavoritos(
              datosFavoritos.map((f: any) => f.pelicula_id) // ✅ GUARDA COMO VENGA (número o texto)
            );
          }
        } else {
          if (activo) {
            setUsuario(null);
            setFavoritos([]);
          }
        }
      } catch (error) {
        console.error('Error cargando sesión:', error);
        if (activo) {
          setUsuario(null);
          setFavoritos([]);
        }
      } finally {
        if (activo) {
          setCargandoSesion(false);
        }
      }
    };

    cargarTodo();

    // ==============================
    // ESCUCHAR CAMBIOS DE SESIÓN
    // ==============================
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

        // ✅ CARGAR FAVORITOS AL INICIAR SESIÓN
        const { data: datosFavoritos } = await supabase
          .from('favoritos')
          .select('pelicula_id')
          .eq('user_id', user.id);

        setFavoritos(datosFavoritos?.map((f: any) => f.pelicula_id) || []);
      } else {
        setUsuario(null);
        setFavoritos([]);
      }
      setCargandoSesion(false);
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
      return;
    }
    setUsuario(null);
    setFavoritos([]);
  };

  // ==============================
  // AGREGAR / QUITAR FAVORITO → GUARDAR EN SUPABASE
  // ==============================
  const alternarFavorito = async (idPelicula: number | string) => {
    if (!usuario) return;
    const idComoTexto = String(idPelicula); // ✅ CONVERTIMOS TODO A TEXTO

    // Obtener el ID real del usuario desde Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    // ✅ COMPARAMOS COMO TEXTO PARA QUE NO FALLE
    const yaEsFavorito = favoritos.some(id => String(id) === idComoTexto);

    if (yaEsFavorito) {
      // ❌ QUITAR DE FAVORITOS
      await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', userId)
        .eq('pelicula_id', idComoTexto); // ✅ TEXTO

      setFavoritos((prev) => prev.filter(id => String(id) !== idComoTexto));
    } else {
      // ✅ AGREGAR A FAVORITOS
      await supabase
        .from('favoritos')
        .insert({ user_id: userId, pelicula_id: idComoTexto }); // ✅ TEXTO

      setFavoritos((prev) => [...prev, idPelicula]);
    }
  };

  // ==============================
  // COMPROBAR FAVORITO
  // ==============================
  const esFavorito = (idPelicula: number | string) => {
    const idComoTexto = String(idPelicula);
    return favoritos.some(id => String(id) === idComoTexto); // ✅ COMPARA COMO TEXTO
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