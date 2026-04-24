"use client";

import React, { useRef } from "react";
import { Camera, Upload } from "lucide-react";

interface UploadButtonProps {
  onUpload: (base64: string) => void;
}

export function UploadButton({ onUpload }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-6 animate-float">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="group relative w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-white clay-shadow flex flex-col items-center justify-center border-4 border-primary/20 transition-all active:scale-95 hover:border-primary/40 overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        <Camera className="w-10 h-10 sm:w-16 sm:h-16 text-primary mb-1 sm:mb-2 relative z-10" />
        <span className="text-primary font-bold text-sm sm:text-lg relative z-10">
          Tomar Foto
        </span>
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 text-secondary font-medium hover:underline underline-offset-4"
      >
        <Upload className="w-5 h-5" />
        O subir desde galería
      </button>
    </div>
  );
}
