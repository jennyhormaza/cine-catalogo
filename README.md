# 🎬 Catálogo de Películas

Aplicación web para explorar, buscar y gestionar películas. Permite a los usuarios ver películas desde una API externa, crear sus propias películas con imágenes y gestionarlas según su rol.

## 🌐 URL del proyecto
🔗 **En Vercel:** https://tu-enlace-aqui.vercel.app

## 📸 Capturas
*(Pega aquí tus capturas de pantalla)*

## 🛠️ Tecnologías utilizadas
- **Next.js 16** — Framework web
- **TypeScript** — Tipos de datos
- **Tailwind CSS** — Diseño
- **Supabase** — Base de datos, autenticación y almacenamiento de imágenes
- **TMDB API** — Fuente externa de películas
- **Vercel** — Despliegue

## 👤 Roles de usuario
| Rol | Permisos |
|---|---|
| **Usuario** | Ver películas, buscar, filtrar, ver detalles, agregar favoritos |
| **Administrador** | Todo lo anterior + Crear, Editar y Eliminar películas propias |

## 📊 Base de datos
- **profiles** → Información extendida del usuario
- **movies** → Películas creadas por los usuarios
- **Relación:** Un usuario puede tener muchas películas (uno-a-muchos)

## 🚀 Funcionalidades
- ✅ Ver películas populares desde API externa
- ✅ Búsqueda por nombre, filtro por género y por año
- ✅ Detalle de cada película
- ✅ Registro, Inicio y Cierre de sesión
- ✅ Crear películas con imagen (subida a la nube)
- ✅ Editar y eliminar mis películas
- ✅ Protección de rutas según sesión
- ✅ Imágenes públicas accesibles desde cualquier lugar
- ✅ Diseño adaptable a móvil y escritorio

## 🔧 Variables de entorno

TMDB_API_KEY=266b56c8421f5c98588383cfe59d4d31
TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_SUPABASE_URL=https://nxfocqbwdluqwetowuur.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tSH8N1_-RaHTx3hnfWU0sQ_ZYnm8Zmk


## 👤 Autor
Jenny Hormaza García