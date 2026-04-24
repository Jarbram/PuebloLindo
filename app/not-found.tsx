import Link from "next/link";
import { Sparkles, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 bg-[#F9F7F2] noise">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Decorative 404 */}
        <div className="relative">
          <p
            className="text-[8rem] sm:text-[10rem] font-serif font-bold leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #D2691E 0%, #B05518 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: 0.15,
            }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 terracotta-gradient rounded-2xl flex items-center justify-center shadow-xl rotate-12">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-serif text-[#2F4F4F]">
            Página no encontrada
          </h2>
          <p className="text-[#8B8B8B] text-base leading-relaxed">
            La página que buscas no existe o fue movida.
            Quizás se perdió entre los telares y los hornos del pueblo.
          </p>
        </div>

        {/* Action */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 terracotta-gradient text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
