"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 bg-[#F9F7F2] noise">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
          <div className="relative w-24 h-24 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-serif text-[#2F4F4F]">
            Algo salió mal
          </h2>
          <p className="text-[#8B8B8B] text-base leading-relaxed">
            Ocurrió un error inesperado al procesar tu solicitud.
            No te preocupes, tu información está segura.
          </p>
          {error.digest && (
            <p className="text-xs text-[#8B8B8B]/60 font-mono tracking-wide">
              Ref: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3.5 bg-[linear-gradient(135deg,#D2691E_0%,#B05518_100%)] text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="px-6 py-3.5 bg-white border-2 border-[#E9DCC9] text-[#2F4F4F] rounded-2xl font-bold text-sm hover:border-[#D2691E]/30 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
