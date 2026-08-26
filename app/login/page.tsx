'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSesion } from '@/app/proveedor';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const { iniciarSesion } = useSesion();
  const router = useRouter();

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Botón presionado"); // ← Para ver si funciona

    if (!nombre.trim() || !email.trim()) {
      alert("⚠️ Escribe tu nombre y correo");
      return;
    }

    iniciarSesion({ nombre, email });
    console.log("✅ Sesión iniciada por:", nombre);
    router.push("/"); // ← Volver al inicio
  };

  return (
    <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block text-yellow-400 mb-6">← Volver al inicio</Link>
        
        <h1 className="text-3xl font-black mb-6">👤 Iniciar Sesión</h1>
        
        <form onSubmit={entrar} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Tu Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-black font-bold py-3 rounded-xl transition mt-2"
          >
            ✅ Entrar al Catálogo
          </button>
        </form>
        
        <p className="text-white/40 text-sm mt-6 text-center">
          Solo necesitas tu nombre y correo. ¡Sin contraseña!
        </p>
      </div>
    </main>
  );
}