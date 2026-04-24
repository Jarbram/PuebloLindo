"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F9F7F2",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#2F4F4F",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <div
            style={{
              width: "5rem",
              height: "5rem",
              borderRadius: "50%",
              background: "#FEF2F2",
              border: "2px solid #FECACA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              marginBottom: "0.75rem",
            }}
          >
            Error crítico
          </h1>
          <p
            style={{
              color: "#8B8B8B",
              fontSize: "0.95rem",
              lineHeight: "1.6",
              marginBottom: "2rem",
            }}
          >
            Ocurrió un error inesperado en la aplicación.
            Por favor, intenta recargar la página.
          </p>

          <button
            onClick={reset}
            style={{
              padding: "0.85rem 1.5rem",
              background: "linear-gradient(135deg, #D2691E 0%, #B05518 100%)",
              color: "white",
              border: "none",
              borderRadius: "1rem",
              fontWeight: "700",
              fontSize: "0.875rem",
              cursor: "pointer",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
          >
            Recargar página
          </button>
        </div>
      </body>
    </html>
  );
}
