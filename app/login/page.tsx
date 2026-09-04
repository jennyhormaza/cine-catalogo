'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('Entrando...');

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: clave
    });

    if (error) {
      setMensaje('❌ Error: ' + error.message);
    } else {
      setMensaje('✅ ¡Bienvenido!');
      // ✅ CORREGIDO: AHORA VA A LA PÁGINA PRINCIPAL
      setTimeout(() => router.push('/'), 1000);
    }
  };

  return (
    <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 Iniciar Sesión</h1>
        <form onSubmit={entrar} className="space-y-4">
          <input
            type="email"
            placeholder="Tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-yellow-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Tu contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-yellow-400 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
          >
            ✅ Entrar
          </button>
        </form>
        {mensaje && <p className="text-center mt-4 text-sm">{mensaje}</p>}
        <p className="text-center mt-4 text-sm text-gray-400">
          ¿No tienes cuenta? <Link href="/register" className="text-yellow-400 hover:underline">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}