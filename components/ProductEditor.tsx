"use client";

import React, { useState } from "react";
import { ProductData } from "@/app/actions";
import { Check, Edit2, Package, History, Hammer } from "lucide-react";
import Image from "next/image";

interface ProductEditorProps {
  initialData: ProductData;
  imageUrl: string;
  onSave: (data: ProductData) => void;
}

export function ProductEditor({ initialData, imageUrl, onSave }: ProductEditorProps) {
  const [data, setData] = useState<ProductData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom duration-700">
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden clay-shadow group">
        <Image
          src={imageUrl}
          alt="Vista previa"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-white/80 text-sm font-medium mb-1">Imagen detectada</p>
          <h3 className="text-white text-xl font-serif">{data.title}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
            <Package className="w-4 h-4" />
            Nombre de la Artesanía
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full bg-white border-2 border-accent rounded-2xl px-6 py-4 font-serif text-lg focus:outline-none focus:border-primary transition-colors text-foreground"
            required
            placeholder="Ej. Jarrón de Barro Negro"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
            <History className="w-4 h-4" />
            Historia y Descripción
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={5}
            className="w-full bg-white border-2 border-accent rounded-2xl px-6 py-4 font-sans text-base focus:outline-none focus:border-primary transition-colors resize-none text-foreground"
            required
            placeholder="Cuéntanos la historia de esta pieza..."
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
            <Hammer className="w-4 h-4" />
            Materiales Principales
          </label>
          <input
            type="text"
            value={data.materials}
            onChange={(e) => setData({ ...data, materials: e.target.value })}
            className="w-full bg-white border-2 border-accent rounded-2xl px-6 py-4 font-sans text-base focus:outline-none focus:border-primary transition-colors text-foreground"
            required
            placeholder="Ej. Barro, pintura natural, esmalte"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full terracotta-gradient text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-6 h-6" />
              Aprobar y Publicar
            </>
          )}
        </button>
      </form>
    </div>
  );
}
