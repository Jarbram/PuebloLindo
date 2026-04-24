"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type ToastVariant = "error" | "success" | "info";

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastVariant, typeof AlertTriangle> = {
  error: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

const STYLES: Record<ToastVariant, { bg: string; border: string; icon: string; title: string }> = {
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-500",
    title: "text-red-800",
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "text-emerald-500",
    title: "text-emerald-800",
  },
  info: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-500",
    title: "text-amber-800",
  },
};

const AUTO_DISMISS_MS: Record<ToastVariant, number> = {
  error: 6000,
  success: 4000,
  info: 5000,
};

function ToastItem({ toast, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const style = STYLES[toast.variant];
  const Icon = ICONS[toast.variant];

  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS[toast.variant]);
    return () => clearTimeout(timer);
  }, [dismiss, toast.variant]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative flex items-start gap-3 w-full max-w-sm px-4 py-3.5
        ${style.bg} ${style.border} border-2
        rounded-2xl shadow-xl backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isExiting
          ? "opacity-0 translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100"
        }
      `}
      style={{
        animation: isExiting ? "none" : "toastSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className={`flex-shrink-0 mt-0.5 ${style.icon}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${style.title}`}>
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-xs text-muted mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={dismiss}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5 text-muted" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-black/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${style.icon.replace("text-", "bg-")} rounded-full`}
          style={{
            animation: `toastProgress ${AUTO_DISMISS_MS[toast.variant]}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

/** Hook to manage toast state */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, variant, title, description }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    error: (title: string, description?: string) => addToast("error", title, description),
    success: (title: string, description?: string) => addToast("success", title, description),
    info: (title: string, description?: string) => addToast("info", title, description),
  };

  return { toasts, toast, dismissToast };
}

/** Render this once in your layout/page to display toasts */
export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse gap-2 items-center pointer-events-none"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
