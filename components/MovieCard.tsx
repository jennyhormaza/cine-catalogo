export interface MovieCardProps {
  title: string;
  year: string;
  imageUrl: string;
  description: string;
}

export default function MovieCard({ title, year, imageUrl, description }: MovieCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-64 object-cover"
        />
        <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
          {year}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">{title}</h3>
        <p className="text-gray-300 text-sm line-clamp-3 mb-4">{description}</p>
        <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition">
          Ver Detalle
        </button>
      </div>
    </div>
  );
}