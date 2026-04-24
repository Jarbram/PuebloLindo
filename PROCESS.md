# PROCESS.md — Reflexión del Proceso de Construcción

## 1. ¿Cómo usé la IA durante el desarrollo?

### La IA como pair-programmer, no como autopiloto

Usé un asistente de IA (Antigravity / Claude) como **par de programación** a lo largo de todo el ciclo de desarrollo. La dinámica fue iterativa: yo definía el *qué* y el *por qué*, y la IA me ayudaba con el *cómo*, generando código que yo revisaba, editaba y aprobaba antes de integrar.

La IA no escribió el proyecto de principio a fin de una vez. El desarrollo fue una **conversación continua** dividida en sesiones temáticas, cada una con un objetivo concreto:

1. **Scaffolding inicial** — `create-next-app` con TypeScript + Tailwind.
2. **Configuración de entorno** — variables de Supabase y OpenAI.
3. **Core feature: upload → análisis → editor** — el flujo completo con server actions.
4. **Vista de inventario** — `InventoryGrid` + `InventoryCard` con búsqueda y vistas grid/lista.
5. **Debugging** — corrección de rutas de importación y errores de módulos.

### Prompts que funcionaron bien

| Prompt (resumido) | Por qué funcionó |
|---|---|
| *"Quiero resolver el problema del catálogo incompleto de PuebloLindo. Los artesanos suben fotos sin descripción y el equipo las llena a mano. Necesito una app Next.js con Supabase donde el artesano suba una foto, GPT-4o Vision la analice y genere título, descripción y materiales automáticamente, y el artesano pueda editar antes de publicar"* | Este fue el prompt con el que arranqué todo el proyecto. Funcionó porque le di el **problema de negocio**, la **solución técnica** y el **flujo de usuario** completo en un solo mensaje. La IA entendió el contexto end-to-end y generó la estructura base del proyecto alineada con esa visión. |
| *"Necesito una vista de inventario para ver las artesanías que ya subí. Crea una ruta /inventario que haga fetch de los productos desde Supabase y los muestre en cards con imagen, título, descripción y materiales. Agrega búsqueda y un toggle grid/lista"* | Pedí esta vista porque después de subir varias piezas necesitaba poder verlas y buscarlas. Al especificar la ruta, los datos a mostrar y las features (búsqueda + vistas), la IA generó `InventoryGrid` + `InventoryCard` con tipado correcto desde el primer intento. |
| *"Diseña el prompt del sistema para GPT-4o Vision como curador experto en artesanías rurales. Debe generar título, descripción narrativa y materiales en JSON"* | Le di el **rol**, el **formato de salida** y el **tono** deseado. El prompt resultante menciona técnicas artesanales específicas (telar, quemado de cerámica) y genera descripciones culturalmente ricas. |

### Prompts que necesitaron iteración

| Prompt (resumido) | Qué falló y cómo lo corregí |
|---|---|
| *"Agrega manejo de errores"* | Sin especificar *dónde* ni *qué tipo* de errores, la IA agregó try-catch genéricos. Replanteé: *"En `analyzeImage`, maneja rate limits (429), API key inválida (401) y respuesta vacía del modelo con mensajes en español para el usuario"*. Ahí sí generó el error handling granular que necesitaba. |

---

## 2. ¿En qué momento cambié de enfoque y por qué?

### Cambio 1: De n8n + WhatsApp a una web app

**Cuándo**: Al inicio, antes de escribir una sola línea de código.

**Qué pasó**: Mi primera idea fue montar un flujo de automatización con **n8n** conectado a **WhatsApp**: el artesano enviaría la foto de su pieza por WhatsApp, n8n la recibiría vía webhook, la enviaría a GPT-4o Vision para el análisis, y devolvería la descripción generada por el mismo chat. Todo sin que el artesano saliera de una app que ya usa a diario.

**Por qué cambié**: Aunque la idea era atractiva por la familiaridad de WhatsApp, me di cuenta de varios problemas:
- **Visualización limitada**: WhatsApp no me daba control sobre cómo presentar los resultados. El artesano recibiría un bloque de texto plano sin poder ver la pieza junto a su descripción, ni editar campos individuales.
- **Sin interfaz de edición**: El flujo human-in-the-loop (que el artesano revise y edite antes de publicar). Necesitaba un editor con campos editables.
- **Agilidad de desarrollo**: Configurar n8n + la API de WhatsApp Business + webhooks + persistencia tomaba más tiempo que levantar una web sencilla con Next.js, y el resultado sería menos flexible.
- **Sin inventario visible**: No habría forma de que el artesano viera su catálogo completo, buscara piezas o verificara qué ya subió.

Una **web sencilla e intuitiva** me pareció mejor opción: el artesano abre la página, sube la foto, ve el resultado al instante con la imagen al lado, edita lo que quiera, y publica. Todo en una sola interfaz visual.

**Impacto**: Gané control total sobre la experiencia de usuario. El flujo de 4 pasos (`upload → analyzing → editor → success`) es más claro que cualquier conversación de chat, y la vista de inventario le da al artesano una visión completa de su catálogo.

### Cambio 2: De componente único a vista de inventario separada

**Cuándo**: Después de tener el flujo de upload funcionando.

**Qué pasó**: Originalmente, los productos guardados se almacenaban en Supabase sin ningun feedback visual, funcionaba pero no permitia ver los productos previos ya subidos.

**Por qué cambié**: cree una vista (`/inventario`) con componentes dedicados (`InventoryGrid`, `InventoryCard`). Esto permitió:
- Agregar búsqueda y filtrado sin complicar la página de upload.
- Implementar vistas grid/lista con un toggle.
- Usar un Server Component para la página (fetch en el servidor, sin estado de carga en el cliente).

**Impacto**: La arquitectura quedó más limpia. Cada ruta tiene una responsabilidad clara: `/` para crear, `/inventario` para explorar.

---

## 3. ¿Qué mejoraría si tuviera una semana más?

### Prioridad Alta (impacto directo en el producto)

| Mejora | Descripción | Esfuerzo estimado |
|--------|-------------|-------------------|
| **Autenticación con roles** | Implementar Supabase Auth con al menos dos roles: `artesano` (sube y edita sus propios productos) y `operador` (puede editar cualquier producto). Activar RLS real en la tabla `products`. | 1 dia |
| **Procesamiento batch** | Permitir subir 5-10 fotos a la vez, procesarlas en cola y mostrar el progreso. Muchos artesanos tienen decenas de piezas por catalogar. | 1.5 días |
| **Edición post-publicación** | Actualmente, una vez que se publica un producto no se puede editar. Agregaría un botón "Editar" en cada `InventoryCard` que abra el `ProductEditor` pre-llenado. | 1 día |

### Prioridad Media (calidad y experiencia)

| Mejora | Descripción | Esfuerzo estimado |
|--------|-------------|-------------------|
| **Traducciones automáticas** | Generar descripciones en inglés y portugués en el mismo request a GPT-4o para el mercado internacional. | 0.5 días |
| **Validación de calidad de imagen** | Antes de enviar a la IA, verificar que la imagen no esté borrosa, demasiado oscura o sin foco. Podría usar un modelo ligero o heurísticas de histograma. | 1 día |
| **Dashboard de completitud** | Métricas que muestren: % del catálogo con descripción completa, últimas piezas subidas, productos sin imagen, etc. | 1 día |
| **Tests automatizados** | e2e con Playwright para el flujo completo de upload + análisis + guardado, y unit tests para los server actions. | 1.5 días |

### Prioridad Baja (optimización y escala)

| Mejora | Descripción | Esfuerzo estimado |
|--------|-------------|-------------------|
| **Upload directo a Storage** | Cambiar de base64-en-memoria a presigned URLs de Supabase Storage para manejar imágenes >10MB sin presión en la memoria del servidor. | 0.5 días |
| **Detección de duplicados** | Usar hashing perceptual (pHash) o embeddings de CLIP para detectar si un artesano sube la misma pieza dos veces. | 1 día |
| **Cache de análisis** | Si la misma imagen se sube de nuevo, devolver el análisis cacheado en lugar de gastar otro request a OpenAI. | 0.5 días |
| **Modelo fine-tuned** | Entrenar un adaptador LoRA sobre un modelo de visión open-source (LLaVA) especializado en artesanías latinoamericanas, para reducir costos y latencia. | 3-5 días |

### Lo que más me gustaría hacer

Si tuviera que elegir **una sola mejora**, sería el **procesamiento batch con cola de trabajo**. Es la funcionalidad que más impacto tendría para un artesano real: poder vaciar la galería del celular con 20 fotos de piezas y que el sistema las procese todas, generando un catálogo completo en minutos en lugar de una pieza a la vez.

---

## Resumen

> El desarrollo fue un diálogo constante con la IA. Los mejores resultados vinieron cuando le daba contexto rico y objetivos específicos. Los peores, cuando le pedía cosas vagas como "haz que se vea bonito". Cambié de enfoque 3 veces — siempre hacia más simplicidad para el usuario final. Si tuviera más tiempo, el procesamiento batch y la autenticación serían mis primeros dos sprints.

---

## 4. Robustez y Visión a Futuro

### ⛓️ Escalamiento Humano (Human-in-the-loop)
El sistema ha evolucionado para detectar sus propias limitaciones. No todas las imágenes son perfectas; a veces el ángulo es difícil o la iluminación oculta detalles críticos.
- **Detección de Incertidumbre**: El prompt del sistema ahora obliga a la IA a evaluar su propia confianza (`ai_confidence`). Si el modelo detecta ambigüedad (score < 0.8), marca automáticamente la pieza con `needs_review: true`.
- **Flujo Curatorial**: En el inventario, estas piezas se destacan con una insignia de **"Revisión Pendiente"**. Esto permite que un experto humano verifique los datos generados por la IA, asegurando que el catálogo final mantenga los estándares de calidad de PuebloLindo.

### 🚫 Verificación Anti-Alucinación
Uno de los mayores riesgos de la IA generativa es la "alucinación" de detalles. Para mitigar esto, implementamos una estrategia de **Evidencia Visual**:
- **Cita de Evidencia**: La IA debe completar un campo `visual_evidence` explicando qué elemento específico de la imagen justifica cada material y técnica mencionada (ej: *"textura porosa granular típica del barro negro"*).
- **Control de Inventiva**: El sistema tiene instrucciones estrictas de marcar `needs_review` si no puede ver pistas visuales claras, en lugar de intentar adivinar. Esto garantiza que cada descripción esté fundamentada en hechos visuales.

### 📈 Estrategia de Escalamiento 10x
Si PuebloLindo escalara a miles de artesanos y piezas diarias, la arquitectura está preparada para crecer:
1.  **Optimización Postgres (Supabase)**: Implementación de índices `GIN` y `B-Tree` en campos de búsqueda y confianza para mantener el inventario rápido con grandes volúmenes de datos.
2.  **Procesamiento Asíncrono**: Uso de **Next.js After** para que el almacenamiento de la imagen y el análisis por IA ocurran en una tarea secundaria, liberando la interfaz del usuario inmediatamente.
3.  **Monitoreo de Deriva (Drift Monitoring)**: Almacenar la confianza promedio de la IA para detectar si el rendimiento del modelo cambia con nuevas categorías de artesanías y ajustar los prompts proporcionalmente.
4.  **Content Delivery Network (CDN)**: Optimización de imágenes mediante el CDN de Supabase para asegurar tiempos de carga rápidos en zonas rurales con baja conectividad.

