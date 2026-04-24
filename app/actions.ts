"use server";

import { revalidatePath } from "next/cache";
import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";

export type ProductData = {
  title: string;
  description: string;
  materials: string;
};

export type Product = ProductData & {
  id: string;
  image_url: string | null;
  created_at: string;
  status: string;
};

/**
 * Sube una imagen base64 a Supabase Storage y devuelve la URL pública.
 */
export async function uploadImage(base64Image: string): Promise<string> {
  const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Formato de imagen inválido. Asegúrate de subir un archivo JPG, PNG o WebP.");
  }

  const type = matches[1];
  const buffer = Buffer.from(matches[2], "base64");

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (buffer.byteLength > maxSize) {
    throw new Error("La imagen es demasiado grande. El tamaño máximo es 10 MB.");
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(fileName, buffer, {
      contentType: type,
      upsert: true,
    });

  if (error) {
    console.error("Storage upload error:", JSON.stringify(error, null, 2));

    if ((error as any).statusCode === 413) {
      throw new Error("La imagen es demasiado grande para el almacenamiento.");
    }
    if ((error as any).statusCode === 403) {
      throw new Error("No tienes permisos para subir imágenes. Verifica la configuración de Storage.");
    }

    throw new Error("Error al subir la imagen. Verifica tu conexión e intenta de nuevo.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  return publicUrl;
}

export async function analyzeImage(base64Image: string): Promise<ProductData> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Eres un experto curador de artesanías rurales para el catálogo "PuebloLindo". 
          Tu tarea es observar la imagen de una artesanía y extraer los datos necesarios para el catálogo.
          Te especializas en una amplia gama de categorías: Textiles (tejidos, bordados), Cerámica (barro, alfarería), Orfebrería, Talla en Madera, Cestería y Talabartería.
          
          Debes devolver un JSON con los campos: 
          - "title": Atractivo, poético y descriptivo.
          - "description": Una historia breve (2-3 párrafos) que resalte el valor cultural, la técnica ancestral utilizada y el sentimiento de la pieza.
          - "materials": Identifica los materiales naturales específicos detectados.
          
          Sé específico según la técnica (ej. si es textil, menciona el tipo de telar si es evidente; si es cerámica, el tipo de quemado). Usa un tono cálido, respetuoso y profesional.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analiza esta artesanía y genera los datos para el catálogo.",
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("La IA no pudo generar una respuesta. Intenta con otra imagen.");
    }

    const parsed = JSON.parse(content) as ProductData;

    // Validate the AI response has required fields
    if (!parsed.title || !parsed.description || !parsed.materials) {
      throw new Error("La IA no pudo identificar todos los detalles. Intenta con una imagen más clara.");
    }

    return parsed;
  } catch (error) {
    // Re-throw our own errors
    if (error instanceof Error && error.message.startsWith("La IA")) {
      throw error;
    }

    // Handle API-specific errors
    if (error instanceof Error) {
      if (error.message.includes("rate_limit") || error.message.includes("429")) {
        throw new Error("El servicio de IA está ocupado. Espera un momento e intenta de nuevo.");
      }
      if (error.message.includes("API key") || error.message.includes("401")) {
        throw new Error("Error de configuración del servicio de IA. Contacta al administrador.");
      }
    }

    console.error("AI analysis error:", error);
    throw new Error("Error al analizar la imagen. Verifica tu conexión e intenta de nuevo.");
  }
}

export async function saveProduct(data: ProductData & { image_url?: string }) {
  const { data: result, error } = await supabase
    .from("products")
    .insert([
      {
        title: data.title.trim(),
        description: data.description.trim(),
        materials: data.materials.trim(),
        image_url: data.image_url,
      },
    ])
    .select();

  if (error) {
    console.error("Database insert error:", error);

    if (error.code === "23505") {
      throw new Error("Ya existe una artesanía con ese nombre.");
    }
    if (error.code === "23502") {
      throw new Error("Faltan campos obligatorios. Completa el nombre, descripción y materiales.");
    }
    if (error.code === "42501") {
      throw new Error("No tienes permisos para guardar artesanías. Verifica la configuración de RLS.");
    }

    throw new Error("No se pudo guardar la artesanía. Verifica tu conexión e intenta de nuevo.");
  }

  // Revalidar la página de inventario para que muestre el nuevo producto
  revalidatePath("/inventario");

  return result[0];
}

/**
 * Obtiene todos los productos del catálogo ordenados por fecha de creación.
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, description, materials, image_url, created_at, status")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Database query error:", error);
    throw new Error("No se pudieron cargar las artesanías. Verifica tu conexión.");
  }

  return (data ?? []) as Product[];
}
