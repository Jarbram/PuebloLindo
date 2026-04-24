import { getProducts } from "@/app/actions";
import { InventoryGrid } from "@/components/InventoryGrid";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

// Siempre obtener datos frescos de la base de datos
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inventario | PuebloLindo",
  description:
    "Explora todas las artesanías registradas en el catálogo PuebloLindo.",
};

export default async function InventarioPage() {
  const products = await getProducts();

  return (
    <div className="flex-1 flex flex-col noise relative min-h-[100dvh]">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between sticky top-0 bg-[#F9F7F2]/80 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 terracotta-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif text-foreground tracking-tight">
            Pueblo<span className="text-primary italic">Lindo</span>
          </h1>
        </Link>

        <Link
          href="/"
          className="px-3.5 py-2 sm:px-5 sm:py-2.5 terracotta-gradient text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all whitespace-nowrap"
        >
          + Nueva Pieza
        </Link>
      </header>

      {/* Page title section */}
      <section className="px-4 sm:px-6 pt-2 pb-4 sm:pt-4 sm:pb-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-primary text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2">
              Catálogo Completo
            </p>
            <h2 className="text-2xl sm:text-4xl font-serif text-foreground leading-tight">
              Inventario de Artesanías
            </h2>
          </div>
          <p className="text-muted text-xs sm:text-sm font-medium tabular-nums">
            {products.length}{" "}
            {products.length === 1 ? "pieza registrada" : "piezas registradas"}
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-3 sm:mt-6 h-px bg-gradient-to-r from-primary/40 via-accent to-transparent" />
      </section>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 pb-6 sm:pb-16 max-w-7xl mx-auto w-full">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6">
              <span className="text-4xl">🏺</span>
            </div>
            <h3 className="text-2xl font-serif text-foreground mb-3">
              Sin artesanías todavía
            </h3>
            <p className="text-muted text-base max-w-sm mb-8">
              Sube tu primera pieza artesanal y comienza a construir tu catálogo
              digital.
            </p>
            <Link
              href="/"
              className="px-8 py-4 terracotta-gradient text-white rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              Subir primera pieza
            </Link>
          </div>
        ) : (
          <InventoryGrid products={products} />
        )}
      </main>

      {/* Footer */}
      <footer className="px-4 py-3 sm:p-8 text-center text-muted text-xs sm:text-sm font-medium">
        &copy; 2026 PuebloLindo • Hecho con ❤️ para el campo
      </footer>
    </div>
  );
}
