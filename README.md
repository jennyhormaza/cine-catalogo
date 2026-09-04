# 🎬 Catálogo de Películas

Aplicación web para explorar, buscar y gestionar películas. Permite a los usuarios ver películas desde una API externa, crear sus propias películas con imágenes y gestionarlas según su rol.

## 🌐 URL del proyecto
🔗 **En Vercel:** https://jennyhormaza-cine-catalogo-alpha.vercel.app/

## 📸 Capturas
<img width="1365" height="636" alt="image" src="https://github.com/user-attachments/assets/6302f5ae-4ada-4720-a766-7dc80ed733ab" />

<img width="1365" height="633" alt="image" src="https://github.com/user-attachments/assets/7b235c6c-a6b7-4e4c-83c5-fc1d4e263dc1" />
<img width="1364" height="661" alt="image" src="https://github.com/user-attachments/assets/8d6d957c-61ce-4c27-b4d6-6d78c13ae309" />
<img width="1365" height="699" alt="image" src="https://github.com/user-attachments/assets/c19a4338-9c49-4eef-991e-ac42d0486565" />

## 🛠️ Tecnologías utilizadas
- **Next.js 16** — Framework web
- **TypeScript** — Tipos de datos
- **Tailwind CSS** — Diseño
- **Supabase** — Base de datos, autenticación y almacenamiento de imágenes
- **TMDB API** — Fuente externa de películas
- **Vercel** — Despliegue

---

## 👤 Roles de Usuario

### 🟢 Usuario

- ✅ Explorar películas populares
- ✅ Buscar películas
- ✅ Ver películas creadas por el administrador
- ✅ Guardar películas en **Mis Favoritos** (privados)
- ❌ No puede crear, editar ni eliminar películas

### 🔧 Administrador

- ✅ Todo lo que hace el Usuario
- ✅ Crear películas propias con imágenes
- ✅ Editar sus películas
- ✅ Eliminar sus películas
- ✅ Las películas que crea son visibles para todos

> ⚠️ Al registrarse se elige el rol una sola vez y **no se puede cambiar después**.

---

## ⭐ Favoritos
- Cada usuario guarda sus propias películas favoritas
- Los favoritos son **privados**: nadie más los ve
- Funciona con películas de TMDB y con películas creadas

---

## ✅ Funcionalidades
- 🔍 Búsqueda de películas
- 🎬 Catálogo completo
- 🔥 Películas en tendencia
- 📂 Películas creadas por el administrador
- ⭐ Mis Favoritos
- 🔐 Inicio y cierre de sesión

---

## ⚙️ Variables de entorno

```env
TMDB_API_KEY=tu_clave_de_tmdb
TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase


## 👤 Autor
Jenny Hormaza García
