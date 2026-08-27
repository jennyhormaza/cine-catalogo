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
  const [confirmarPassword, setConfirmarPassword] =
    useState('');

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    setMensaje('');

    if (
      !nombre.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmarPassword.trim()
    ) {
      setMensaje(
        '⚠️ Completa todos los campos.'
      );
      return;
    }

    if (password.length < 6) {
      setMensaje(
        '⚠️ La contraseña debe tener al menos 6 caracteres.'
      );
      return;
    }

    if (password !== confirmarPassword) {
      setMensaje(
        '⚠️ Las contraseñas no coinciden.'
      );
      return;
    }

    setCargando(true);

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: nombre.trim(),
            },
          },
        });

      if (error) {
        console.error(
          'Error al registrar:',
          error
        );

        setMensaje(`❌ ${error.message}`);
        setCargando(false);
        return;
      }

      console.log(
        '✅ Cuenta creada:',
        data.user
      );

      // Si Supabase permite entrar inmediatamente
      if (data.session) {
        setMensaje(
          '✅ Cuenta creada correctamente.'
        );

        setTimeout(() => {
          router.push('/peliculas');
          router.refresh();
        }, 500);

        return;
      }

      // Si Supabase exige confirmación
      setMensaje(
        '⚠️ Cuenta creada. Revisa tu correo para confirmar la cuenta.'
      );

      setCargando(false);
    } catch (err) {
      console.error(
        'Error inesperado:',
        err
      );

      setMensaje(
        '❌ Ocurrió un error inesperado.'
      );

      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <Link
          href="/"
          className="inline-block text-yellow-400 hover:text-yellow-300 mb-6 transition"
        >
          ← Volver al inicio
        </Link>

        <div className="bg-[#111116] border border-white/10 rounded-3xl p-7 md:p-8 shadow-2xl">

          <div className="text-center mb-7">
            <div className="text-4xl mb-3">
              🎬
            </div>

            <h1 className="text-3xl font-black">
              Crear cuenta
            </h1>

            <p className="text-white/40 text-sm mt-2">
              Únete al catálogo cinematográfico
            </p>
          </div>

          <form
            onSubmit={registrar}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm font-bold mb-2">
                Nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                placeholder="Ej: Jessica Guano"
                autoComplete="name"
                disabled={cargando}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/50 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="tu@correo.com"
                autoComplete="email"
                disabled={cargando}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/50 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                disabled={cargando}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/50 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Confirmar contraseña
              </label>

              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) =>
                  setConfirmarPassword(
                    e.target.value
                  )
                }
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                disabled={cargando}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/50 transition disabled:opacity-50"
              />
            </div>

            {mensaje && (
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm">
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-3.5 rounded-xl transition"
            >
              {cargando
                ? 'Creando cuenta...'
                : 'Crear mi cuenta'}
            </button>

          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            ¿Ya tienes una cuenta?{' '}

            <Link
              href="/login"
              className="text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              Iniciar sesión
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}