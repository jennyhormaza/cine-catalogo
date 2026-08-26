export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-2xl">🎬</span>
          <span className="text-xl font-bold text-yellow-400">CineCatálogo</span>
        </div>
        <p className="text-gray-400 mb-2">
          Catálogo de Películas — Proyecto de Aplicaciones Web
        </p>
        <p className="text-sm text-gray-500">
          Desarrollado con Next.js 14, TypeScript y Tailwind CSS
        </p>
      </div>
    </footer>
  );
}