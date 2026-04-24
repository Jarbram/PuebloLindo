"use client";

import { useState } from "react";
import { UploadButton } from "@/components/UploadButton";
import { LoadingState } from "@/components/LoadingState";
import { ProductEditor } from "@/components/ProductEditor";
import { ToastContainer, useToast } from "@/components/Toast";
import { analyzeImage, ProductData, saveProduct, uploadImage } from "./actions";
import { Sparkles, CheckCircle2, ArrowLeft, RefreshCw, Archive } from "lucide-react";
import Link from "next/link";

type Step = "upload" | "analyzing" | "editor" | "success";

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const { toasts, toast, dismissToast } = useToast();

  const handleUpload = async (base64: string) => {
    setStep("analyzing");
    try {
      const persistentUrl = await uploadImage(base64);
      setImageUrl(persistentUrl);

      const data = await analyzeImage(base64);
      setProductData(data);
      setStep("editor");
    } catch (error) {
      console.error("Analysis failed:", error);
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(
        "Error al procesar la imagen",
        message.includes("Formato") ? message : "Verifica tu conexión e intenta de nuevo."
      );
      setStep("upload");
    }
  };

  const handleSave = async (finalData: ProductData) => {
    try {
      await saveProduct({ ...finalData, image_url: imageUrl });
      setStep("success");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(
        "No se pudo guardar",
        "Hubo un problema al publicar la artesanía. Revisa tu conexión e intenta de nuevo."
      );
    }
  };

  const reset = () => {
    setStep("upload");
    setImageUrl("");
    setProductData(null);
  };

  return (
    <div className="flex-1 flex flex-col noise relative h-[100dvh] overflow-hidden">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between sticky top-0 bg-[#F9F7F2]/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 terracotta-gradient rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif text-foreground tracking-tight">
            Pueblo<span className="text-primary italic">Lindo</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inventario"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-secondary hover:bg-accent transition-colors"
          >
            <Archive className="w-4 h-4" />
            Inventario
          </Link>

          {step !== "upload" && step !== "success" && (
            <button
              onClick={reset}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-secondary" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 max-w-2xl mx-auto w-full min-h-0">
        {step === "upload" && (
          <div className="space-y-6 sm:space-y-10 text-center animate-in fade-in slide-in-from-top-10 duration-1000">
            <div className="space-y-2 sm:space-y-4">
              <h2 className="text-3xl sm:text-5xl font-serif text-foreground leading-tight">
                Convierte tus obras en un <span className="text-primary">catálogo digital</span>
              </h2>
              <p className="text-secondary text-sm sm:text-lg font-medium max-w-sm mx-auto">
                Sube una foto y deja que nuestra IA haga el trabajo pesado por ti.
              </p>
            </div>

            <UploadButton onUpload={handleUpload} />

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-3 sm:pt-6 opacity-50 grayscale">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                AI Powered
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Mobile First
              </div>
            </div>
          </div>
        )}

        {step === "analyzing" && <LoadingState />}

        {step === "editor" && productData && (
          <ProductEditor
            initialData={productData}
            imageUrl={imageUrl}
            onSave={handleSave}
          />
        )}

        {step === "success" && (
          <div className="text-center space-y-8 py-20 animate-in zoom-in fade-in duration-500">
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-secondary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-foreground">¡Artesanía Publicada!</h2>
              <p className="text-secondary text-lg font-medium">
                Tu pieza ya está en el catálogo de PuebloLindo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/inventario"
                className="px-8 py-4 terracotta-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl active:scale-95 transition-all"
              >
                <Archive className="w-5 h-5" />
                Ver inventario
              </Link>
              <button
                onClick={reset}
                className="px-8 py-4 bg-foreground text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Subir otra pieza
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="px-4 py-3 sm:p-8 text-center text-muted text-xs sm:text-sm font-medium">
        &copy; 2026 PuebloLindo • Hecho con ❤️ para el campo
      </footer>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
