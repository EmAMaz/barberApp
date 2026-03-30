"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Instanciamos Supabase (Usa las keys anon aquí, ya que es el cliente)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [procesando, setProcesando] = useState(true);

  // Mercado Pago envía estos datos en la URL al volver
  const status = searchParams.get("status");
  const externalReference = searchParams.get("external_reference");

  useEffect(() => {
    const confirmarReserva = async () => {
      if (status === "approved" && externalReference) {
        try {
          // 1. Decodificar los datos que guardamos en el checkout
          const { turnoId, nombre } = JSON.parse(externalReference);

          // 2. Actualizar en Supabase
          const { data: turnoActualizado, error } = await supabase
            .from("turnos")
            .update({ 
              esta_disponible: false, 
              cliente_nombre: nombre 
            })
            .eq("id", turnoId)
            .select("hora, barberos(telefono_whatsapp)") // Traemos el tel del barbero
            .single();

          if (error) throw error;

          // 3. Redirigir a WhatsApp automáticamente
          if (turnoActualizado) {
            const telefono = turnoActualizado.barberos[0].telefono_whatsapp;
            const hora = turnoActualizado.hora.slice(0, 5);
            const texto = `¡Hola! Soy ${nombre}, ya pagué la seña para el turno de las ${hora}hs.`;
            
            window.location.href = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;
          }
        } catch (err) {
          console.error("Error al procesar el pago:", err);
          setProcesando(false);
        }
      }
    };

    confirmarReserva();
  }, [status, externalReference]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {procesando ? (
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h1 className="text-xl font-bold">Confirmando tu reserva...</h1>
          <p className="text-gray-500">No cierres esta ventana, te redirigiremos a WhatsApp.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-5xl">❌</span>
          <h1 className="text-xl font-bold">Algo salió mal</h1>
          <p className="text-gray-500">Hubo un problema al confirmar tu turno. Por favor, contacta a la barbería.</p>
        </div>
      )}
    </div>
  );
}