import type { NextConfig } from 'next';

const config: NextConfig = {
  // ✅ Agrega ESTA línea exactamente así:
  allowedDevOrigins: ['192.168.56.1'],
  
  // ... deja todo lo demás igual ...
};

export default config;