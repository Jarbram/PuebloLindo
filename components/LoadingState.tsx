"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif text-primary">Analizando artesanía...</h2>
        <p className="text-secondary font-medium animate-pulse">
          Nuestra IA está extrayendo los detalles culturales y materiales
        </p>
      </div>

      <div className="w-64 h-1 bg-primary/10 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
