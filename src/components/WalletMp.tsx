"use client";
import { useEffect, useState } from "react";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";

// Asegúrate de usar tu clave pública de MP
initMercadoPago(process.env.NEXT_PUBLIC_MP_KEY!);

interface CheckoutButtonProps {
  turnoId: string;
  nombre: string;
  precio: number;
}

export default function CheckoutButton({
  turnoId,
  nombre,
  precio,
}: CheckoutButtonProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePreference = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnoId,
          nombre,
          precio,
        }),
      });

      const data = await response.json();

      if (data.id) {
        setPreferenceId(data.id);
      }
    } catch (error) {
      console.error("Error creando preferencia:", error);
      alert("Error al conectar con Mercado Pago");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Si no hay preferencia, mostramos nuestro botón estético */}
      {!preferenceId ? (
        <button
          onClick={handleCreatePreference}
          disabled={isLoading}
          className="cursor-pointer w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 bg-black hover:scale-[1.02] active:scale-95 disabled:bg-gray-400"
        >
          {isLoading ? "PROCESANDO..." : "RESERVAR CON SEÑA"}
          <span className="text-xl">💳</span>
        </button>
      ) : (
        /* Una vez generada la preferencia, aparece el botón real de MP */
        <div className="animate-in fade-in zoom-in-95">
          <Wallet initialization={{ preferenceId }} />
        </div>
      )}
    </div>
  );
}
