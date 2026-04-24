# DECISIONS.md — PuebloLindo: Autocompletado Inteligente del Catálogo

## 1. ¿Qué problema elegí y por qué lo considero el más urgente?

### Problema elegido: **B — Catálogo incompleto**

> Los artesanos suben fotos con descripciones pobres o en blanco. El equipo de operaciones las completa a mano.

### ¿Por qué es el más urgente?

De los tres problemas planteados, el catálogo incompleto es el que tiene **mayor impacto directo en la conversión de ventas** y en la escalabilidad del negocio. Mi razonamiento es el siguiente:

1. **Es el cuello de botella del negocio.** Sin un catálogo completo y atractivo, no hay producto que vender. Un producto sin título, sin descripción o con información pobre simplemente no se vende — sin importar cuántos visitantes lleguen al marketplace. Resolver los problemas A (volumen de consultas) o C (categorización de tickets) tiene poco valor si el catálogo que sostiene al negocio está vacío o incompleto.

2. **El costo de oportunidad es el más alto.** Cada artesanía sin catalogar correctamente es una venta perdida. Si un artesano sube una pieza con una foto pero sin descripción, esa pieza queda invisible o poco atractiva para los compradores internacionales que necesitan entender el contexto cultural, los materiales y la técnica.

3. **Es el problema con mayor apalancamiento de IA.** La visión por computadora (GPT-4o Vision) me permite extraer automáticamente de una imagen: título, descripción narrativa, materiales detectados. Esto convierte un proceso que le tomaba al equipo ~10 minutos por producto en uno de ~30 segundos.

4. **Reduce la carga sobre los otros dos problemas.** Un catálogo completo y bien descrito reduce las consultas de compradores preguntando "¿de qué material es?" o "¿qué tamaño tiene?" (Problema A). También reduce tickets de soporte por información faltante (Problema C).

---

## 2. ¿Qué herramientas y arquitectura uso y por qué esa combinación?

### Stack tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | Next.js 16 + React 19 | Framework full-stack que permite server actions, SSR y una experiencia mobile-first. |
| **Estilos** | Tailwind CSS 4 | Desarrollo rápido de UI responsiva con utilidades; permite iterar sobre el diseño sin archivos CSS separados. |
| **IA / Visión** | OpenAI GPT-4o (Vision) | Modelo multimodal que analiza imágenes y genera texto estructurado en un solo call. Soporta `response_format: json_object` para output consistente. |
| **Base de datos** | Supabase (PostgreSQL) | BaaS con autenticación, storage y base de datos relacional. Permite escalar sin gestionar infraestructura. |
| **Almacenamiento de imágenes** | Supabase Storage | Integración nativa con el resto del stack. Las imágenes se suben como archivos y se obtiene una URL pública inmediatamente. |
| **Lenguaje** | TypeScript | Type-safety end-to-end, desde los server actions hasta los componentes del cliente. |

### Arquitectura del flujo

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Artesano   │     │  Next.js Server  │     │   OpenAI API  │
│  (móvil/web) │────▶│    Actions       │────▶│   GPT-4o      │
│              │     │                  │     │   (Vision)    │
└──────────────┘     └──────────────────┘     └───────────────┘
       │                      │                       │
       │  1. Sube foto        │  2. Envía imagen      │
       │     (base64)         │     como base64       │
       │                      │                       │
       │                      │  3. Recibe JSON:      │
       │                      │     {title,            │
       │                      │      description,      │
       │                      │      materials}        │
       │                      │                       │
       │  4. Muestra editor   │                       │
       │     pre-llenado      │                       │
       │                      │                       │
       │  5. Artesano          │                       │
       │     aprueba/edita    │                       │
       │                      │                       │
       │  6. Guarda en        │                       │
       │     Supabase DB +    │                       │
       │     Storage          │                       │
       └──────────────────────┘                       │
                │                                      │
                ▼                                      │
       ┌──────────────────┐                            │
       │  Supabase        │                            │
       │  (PostgreSQL +   │                            │
       │   Storage)       │                            │
       └──────────────────┘
```

### ¿Por qué elegí esta combinación?

1. **Server Actions de Next.js** eliminan la necesidad de una API REST separada. Las funciones `analyzeImage`, `uploadImage` y `saveProduct` corren en el servidor, lo que protege la API key de OpenAI y reduce la complejidad del despliegue.

2. **GPT-4o con Vision** porque:
   - Analiza la imagen Y genera texto en un solo request.
   - El prompt especializado en artesanías genera descripciones culturalmente ricas (menciona técnicas ancestrales, materiales naturales, contexto cultural).
   - `response_format: json_object` garantiza output parseble sin post-procesamiento.

3. **Supabase** proporciona database + storage + auth en un solo servicio, simplificando operaciones para un equipo pequeño.

4. **El flujo human-in-the-loop** (el artesano puede editar antes de publicar) es una decisión deliberada: la IA sugiere, el humano valida. Esto mantiene la autenticidad del catálogo.

---

## 3. ¿Qué limitaciones tiene mi solución y qué queda fuera del alcance?

### Limitaciones actuales

| Limitación | Impacto | Mitigación |
|-----------|---------|------------|
| **Dependencia de OpenAI** | Si la API cae o se alcanzan rate limits, no se pueden procesar imágenes. | Manejo de errores con mensajes claros. Se podría agregar un fallback a otro modelo (Claude, Gemini o un modelo Chino cuidando mucho el prompt). |
| **Costo por imagen** | Cada análisis con GPT-4o Vision cuesta ~$0.01–0.03 USD por imagen. Con miles de productos, el costo escala. | Aceptable para MVP. A escala, se podría usar un modelo local de visión (LLaVA) o cachear análisis de imágenes similares. |
| **Calidad del análisis depende de la foto** | Fotos borrosas, oscuras o con fondos ruidosos generan descripciones imprecisas. | El editor permite al artesano corregir. Se podría agregar validación de calidad de imagen pre-análisis. |
| **Sin autenticación** | Cualquier persona puede subir y publicar productos (RLS público para el MVP). | Aceptable para demo. En producción se requeriría auth con roles (artesano, operador, admin). |
| **Sin detección de duplicados** | Un artesano podría subir la misma pieza varias veces sin saberlo. | Se podría implementar hashing de imágenes o embeddings visuales para detectar duplicados. |
| **Imágenes en base64 en memoria** | Las imágenes se envían como base64 completo, lo que puede causar problemas con fotos muy grandes. | Límite de 10 MB implementado. Para escala, se debería usar upload directo a Storage con presigned URLs. |

### Fuera del alcance (posibles mejoras futuras)

- **Traducciones automáticas**: Generar descripciones en inglés, portugués y francés para el mercado internacional.
- **Categorización automática**: Clasificar la artesanía en categorías (textil, cerámica, orfebrería, etc.) a partir de la imagen.
- **Procesamiento batch**: Permitir subir múltiples fotos a la vez y procesarlas en cola.
- **Modelo fine-tuned**: Entrenar un modelo especializado en artesanías latinoamericanas para mejorar precisión y reducir costos.
- **Métricas de completitud**: Dashboard que muestre qué porcentaje del catálogo tiene descripciones completas vs. incompletas.
- **Notificaciones al equipo**: Alertar al equipo de operaciones cuando un producto es subido sin descripción (para los que no usan la IA).

---

## Resumen de la decisión

> Elegí automatizar el **completado del catálogo** porque es el cuello de botella que bloquea las ventas. Uso **GPT-4o Vision** para analizar fotos de artesanías y generar título, descripción y materiales automáticamente. El artesano revisa y aprueba antes de publicar. La solución corre sobre **Next.js + Supabase** para minimizar complejidad operativa. Las principales limitaciones son la dependencia de la API de OpenAI y la ausencia de autenticación, ambas aceptables para un MVP.
