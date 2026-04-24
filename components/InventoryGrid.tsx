"use client";

import { useState, useMemo } from "react";
import { Product } from "@/app/actions";
import { InventoryCard } from "./InventoryCard";
import { Search, LayoutGrid, List } from "lucide-react";

interface InventoryGridProps {
  products: Product[];
}

export function InventoryGrid({ products }: InventoryGridProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.materials?.toLowerCase().includes(q) ?? false)
    );
  }, [products, search]);

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Search & controls */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted pointer-events-none" />
          <input
            id="inventory-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar artesanías..."
            className="w-full bg-white border-2 border-accent rounded-xl sm:rounded-2xl pl-9 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 font-sans text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted/60"
          />
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 bg-white border-2 border-accent rounded-xl sm:rounded-2xl p-0.5 sm:p-1 flex-shrink-0">
          <button
            id="view-grid-btn"
            onClick={() => setViewMode("grid")}
            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${
              viewMode === "grid"
                ? "bg-primary text-white shadow-md"
                : "text-muted hover:text-foreground"
            }`}
            aria-label="Vista cuadrícula"
          >
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            id="view-list-btn"
            onClick={() => setViewMode("list")}
            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${
              viewMode === "list"
                ? "bg-primary text-white shadow-md"
                : "text-muted hover:text-foreground"
            }`}
            aria-label="Vista lista"
          >
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Results info */}
      {search.trim() && (
        <p className="text-muted text-sm font-medium">
          {filtered.length}{" "}
          {filtered.length === 1 ? "resultado" : "resultados"} para &ldquo;
          {search}&rdquo;
        </p>
      )}

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-lg">
            No se encontraron artesanías con ese criterio.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((product, index) => (
            <InventoryCard
              key={product.id}
              product={product}
              mode="grid"
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((product, index) => (
            <InventoryCard
              key={product.id}
              product={product}
              mode="list"
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
