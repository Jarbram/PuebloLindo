# 🏺 PuebloLindo — Catálogo Inteligente de Artesanías

> Sube una foto de tu artesanía y deja que la IA genere título, descripción y materiales automáticamente.

**[🚀 Probar en vivo →](https://pueblolindo-catalogo.vercel.app)**

---

## ¿Qué es PuebloLindo?

PuebloLindo es una herramienta web que resuelve el problema del **catálogo incompleto** de artesanías rurales. Los artesanos suben fotos con descripciones pobres o en blanco, y el equipo de operaciones las completa a mano. Esta app automatiza ese proceso usando **GPT-4o Vision** para analizar la imagen y generar metadata rica (título, descripción narrativa, materiales detectados), con un flujo human-in-the-loop donde el artesano revisa y edita antes de publicar.

### Flujo del usuario

```
📷 Sube foto  →  🤖 IA analiza  →  ✏️ Edita/aprueba  →  ✅ Publicado
```

---

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 + React 19 |
| Estilos | Tailwind CSS 4 |
| IA / Visión | OpenAI GPT-4o (Vision) |
| Base de datos | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Lenguaje | TypeScript |
| Iconos | Lucide React |

---

## Requisitos previos

- **Node.js** 18.17 o superior
- **npm** (incluido con Node.js)
- Una cuenta de **[Supabase](https://supabase.com)** (plan gratuito funciona)
- Una API key de **[OpenAI](https://platform.openai.com)** con acceso a GPT-4o

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pueblolindo-catalogo.git
cd pueblolindo-catalogo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.local.example .env.local
```

Y completa con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
OPENAI_API_KEY=sk-tu-api-key
```

### 4. Configurar Supabase

En el dashboard de Supabase, ejecuta el siguiente SQL para crear la tabla de productos:

```sql
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  materials text,
  image_url text,
  artisan_name text,
  status text default 'published'
);

alter table products enable row level security;

create policy "Allow public read access" on products
  for select using (true);

create policy "Allow public insert" on products
  for insert with check (true);
```

También crea un **bucket público** en Supabase Storage llamado `product-images`.

### 5. Ejecutar en modo desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Estructura del proyecto

```
pueblolindo-catalogo/
├── app/
│   ├── page.tsx           # Página principal (flujo upload → análisis → editor)
│   ├── actions.ts         # Server Actions (uploadImage, analyzeImage, saveProduct)
│   ├── inventario/
│   │   └── page.tsx       # Vista de inventario (Server Component)
│   └── globals.css        # Estilos globales y sistema de diseño
├── components/
│   ├── UploadButton.tsx   # Botón de subida de imagen
│   ├── LoadingState.tsx   # Estado de carga con animación
│   ├── ProductEditor.tsx  # Editor pre-llenado por IA
│   ├── InventoryGrid.tsx  # Grid/lista de productos con búsqueda
│   ├── InventoryCard.tsx  # Card individual de producto
│   └── Toast.tsx          # Sistema de notificaciones
├── lib/
│   ├── openai.ts          # Cliente OpenAI
│   └── supabase.ts        # Cliente Supabase
├── schema.sql             # Schema de la base de datos
├── DECISIONS.md           # Decisiones de arquitectura
└── PROCESS.md             # Reflexión del proceso de desarrollo
```

---

## Documentación adicional

- **[DECISIONS.md](./DECISIONS.md)** — Qué problema elegí, por qué, qué stack uso y qué limitaciones tiene.
- **[PROCESS.md](./PROCESS.md)** — Reflexión sobre cómo usé la IA, cambios de enfoque y mejoras futuras.
