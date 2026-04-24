"use client";

import { Product } from "@/app/actions";
import Image from "next/image";
import { Calendar, Hammer, Eye, ImageOff } from "lucide-react";
import { useState } from "react";

interface InventoryCardProps {
  product: Product;
  mode: "grid" | "list";
  index: number;
}

const MONTHS_SHORT = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getUTCDate();
  const month = MONTHS_SHORT[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function MaterialTags({ materials }: { materials: string | null }) {
  if (!materials) return null;

  const tags = materials
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase tracking-wide"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function InventoryCard({ product, mode, index }: InventoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const staggerDelay = `${Math.min(index * 80, 600)}ms`;

  if (mode === "list") {
    return (
      <div
        className="inventory-card-enter bg-white rounded-xl sm:rounded-2xl border-2 border-accent/60 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
        style={{ animationDelay: staggerDelay }}
        id={`product-list-${product.id}`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-40 h-28 sm:h-auto flex-shrink-0 bg-accent/30">
            {product.image_url && !imgError ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, 160px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="w-8 h-8 text-muted/40" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3.5 sm:p-5 flex flex-col gap-2 sm:gap-3 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-serif text-foreground leading-snug truncate">
                {product.title}
              </h3>
              <span
                className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                  product.needs_review
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : product.status === "published"
                    ? "bg-secondary/10 text-secondary"
                    : "bg-muted/10 text-muted"
                }`}
              >
                {product.needs_review ? "Revisión Pendiente" : product.status === "published" ? "Publicada" : "Borrador"}
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-muted leading-relaxed line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-auto pt-1">
              <MaterialTags materials={product.materials} />

              <span className="flex items-center gap-1.5 text-xs text-muted ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(product.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid mode
  return (
    <div
      className="inventory-card-enter group relative bg-white rounded-2xl sm:rounded-3xl border-2 border-accent/60 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl cursor-pointer"
      style={{ animationDelay: staggerDelay }}
      onClick={() => setExpanded(!expanded)}
      id={`product-grid-${product.id}`}
    >
      {/* Image */}
      <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] bg-accent/30 overflow-hidden">
        {product.image_url && !imgError ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-muted/30" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
          <span className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            Ver detalles
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg backdrop-blur-sm ${
              product.needs_review
                ? "bg-amber-500 text-white shadow-sm"
                : product.status === "published"
                ? "bg-secondary/80 text-white"
                : "bg-white/80 text-muted"
            }`}
          >
            {product.needs_review ? "⚠ Revisión" : product.status === "published" ? "Publicada" : "Borrador"}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3.5 sm:p-5 space-y-2 sm:space-y-3">
        <h3 className="text-base sm:text-lg font-serif text-foreground leading-snug line-clamp-2">
          {product.title}
        </h3>

        {product.description && (
          <p
            className={`text-sm text-muted leading-relaxed ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {product.description}
          </p>
        )}

        <div className="pt-1.5 sm:pt-2 space-y-2 sm:space-y-3">
          {product.materials && (
            <div className="flex items-start gap-2">
              <Hammer className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <MaterialTags materials={product.materials} />
                {product.visual_evidence && (
                  <p className="text-[10px] text-muted italic leading-tight">
                    Evidencia: {product.visual_evidence}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-accent/50">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(product.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
