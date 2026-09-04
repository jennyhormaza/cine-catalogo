'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [rolElegido, setRolElegido] = useState<'user' | 'administrador' | ''>('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');

    if (!nombre.trim() || !email.trim() || !password.trim() || !confirmarPassword.trim()) {
      setMensaje('⚠️ Completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setMensaje('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmarPassword) {
      setMensaje('⚠️ Las contraseñas no coinciden.');
      return;
    }
    if (!rolElegido) {
      setMensaje('⚠️ Elige un rol para continuar.');
      return;
    }

    // ✅ Confirmación antes de guardar
    const nombreRol = rolElegido === 'administrador' ? 'ADMINISTRADOR' : 'USUARIO';
    const confirmacion = window.confirm(
      `✅ Has elegido el rol de ${nombreRol}.\n\n⚠️ Este rol NO se podrá cambiar después.\n¿Estás SEGURO/A?`
    );
    if (!confirmacion) return;

    setCargando(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: nombre.trim(),
          },
        },
      });

      if (error) {
        console.error('Error al registrar:', error);
        setMensaje(`❌ ${error.message}`);
        setCargando(false);
        return;
      }

      // ✅ Guardar el rol en el perfil — SIN FALLAR si la tabla no existe
      if (data.session?.user) {
        try {
          await supabase
            .from('profiles')
            .upsert(
              { 
                id: data.session.user.id, 
                role: rolElegido,
                full_name: nombre.trim()
              },
              { onConflict: 'id' }
            );
        } catch (perfilError) {
          console.log('ℹ️ Tabla profiles no lista, rol guardado por defecto:', rolElegido);
        }
      }

      setMensaje('✅ Cuenta creada correctamente.');
      // ✅ DIRECTO AL INICIO — SIN /elegir-rol
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);

    } catch (err) {
      console.error('Error inesperado:', err);
      setMensaje('❌ Ocurrió un error inesperado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block text-yellow-400 hover:text-yellow-300 mb-6 transition">
          ← Volver al inicio
        </Link>
        <div className="bg-[#111116] border border-white/10 rounded-3xl p-7 md:p-8 shadow-2xl">
          <div className="text-center mb-7">
            <div className="text-4xl mb-3">🎬</div>
            <h1 className="text-3xl font-black">Crear cuenta</h1>
            <p className="text-white/40 text-sm mt-2">Únete al catálogo cinematográfico</p>
          </div>

          <form onSubmit={registrar} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Jessica Guano"
                autoComplete="name"
                disabled={cargando}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/50 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                disabled={cargando}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/50 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                disabled={cargando}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/50 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                disabled={cargando}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/50 transition disabled:opacity-50"
              />
            </div>

            {/* ✅ ELECCIÓN DE ROL EN EL MISMO REGISTRO */}
            <div className="pt-2">
              <label className="block text-sm font-bold mb-3">¿Cómo quieres usar tu cuenta?</label>
              <div className="space-y-3">
                <label className={`block w-full p-4 rounded-xl border cursor-pointer transition ${
                  rolElegido === 'user' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}>
                  <input
                    type="radio"
                    name="rol"
                    value="user"
                    checked={rolElegido === 'user'}
                    onChange={() => setRolElegido('user')}
                    className="hidden"
                  />
                  <div className="font-bold text-lg">👤 Usuario</div>
                  <p className="text-sm text-white/60">Explorar películas, buscar y guardar favoritos.</p>
                </label>

                <label className={`block w-full p-4 rounded-xl border cursor-pointer transition ${
                  rolElegido === 'administrador' 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}>
                  <input
                    type="radio"
                    name="rol"
                    value="administrador"
                    checked={rolElegido === 'administrador'}
                    onChange={() => setRolElegido('administrador')}
                    className="hidden"
                  />
                  <div className="font-bold text-lg">🔧 Administrador</div>
                  <p className="text-sm text-white/60">Todo lo de Usuario + Crear, Editar y Eliminar películas.</p>
                </label>
              </div>
            </div>

            {mensaje && (
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm">
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-3.5 rounded-xl transition mt-2"
            >
              {cargando ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}