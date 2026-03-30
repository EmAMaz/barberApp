"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Instanciamos Supabase (cliente anónimo)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- COMPONENTE CON LA LÓGICA (SuccessContent) ---
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [estado, setEstado] = useState<"verificando" | "confirmado" | "error">(
    "verificando"
  );
  const [datosTurno, setDatosTurno] = useState<any>(null);

  const status = searchParams.get("status");
  const externalReference = searchParams.get("external_reference");

  useEffect(() => {
    const confirmarPagoYGuardar = async () => {
      // 1. Validaciones iniciales
      if (!externalReference || status !== "approved") {
        setEstado("error");
        return;
      }

      try {
        // 2. Decodificar los datos guardados en el checkout
        const { turnoId, nombre } = JSON.parse(externalReference);

        // 3. Actualizar Supabase (Marcar turno como ocupado)
        // Usamos .select().single() para obtener los datos actualizados al instante
        const { data, error } = await supabase
          .from("turnos")
          .update({
            esta_disponible: false,
            cliente_nombre: nombre,
          })
          .eq("id", turnoId)
          .select("id, hora")
          .single();

        if (error) throw error;

        // 4. Guardar datos en el estado para mostrarlos
        if (data) {
          setDatosTurno({ ...data, nombreCliente: nombre });
          setEstado("confirmado");
        }
      } catch (err) {
        console.error("❌ Error confirmando reserva:", err);
        setEstado("error");
      }
    };

    confirmarPagoYGuardar();
  }, [status, externalReference]);

  // --- RENDERIZADO SEGÚN EL ESTADO ---

  // 1. Estado: VERIFICANDO
  if (estado === "verificando") {
    return (
      <div className="space-y-6">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Procesando Pago
          </p>
          <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900">
            Estamos validando tu seña...
          </h1>
        </div>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Por favor no cierres esta pestaña, te confirmaremos en unos segundos.
        </p>
      </div>
    );
  }

  // 2. Estado: ERROR
  if (estado === "error") {
    return (
      <div className="space-y-6">
        <span className="text-6xl">⚠️</span>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mt-4">
            Algo salió mal
          </p>
          <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900">
            Hubo un problema con la reserva
          </h1>
        </div>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          No pudimos confirmar tu turno. Si el pago se debitó, por favor contacta a la barbería directamente.
        </p>
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-2xl font-black text-white bg-black hover:scale-[1.02] active:scale-95 transition-all"
        >
          VOLVER A INTENTAR
        </button>
      </div>
    );
  }

  // 3. Estado: CONFIRMADO
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ICONO DE ÉXITO PREMIUM */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-5xl shadow-xl">
          ✓
        </div>
      </div>

      {/* TEXTOS PRINCIPALES */}
      <div className="space-y-2">
        <div className="flex justify-center items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-[10px] font-bold text-green-700 uppercase tracking-[0.2em]">
            Pago Exitoso
          </p>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">
          ¡TURNO CONFIRMADO!
        </h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Gracias {datosTurno?.nombreCliente}, tu seña de $2.000 fue procesada
          correctamente por Mercado Pago.
        </p>
      </div>

      {/* TARJETA DE RESUMEN (ESTILO AGENDA) */}
      <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl space-y-4 shadow-inner">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Tu Cita
          </p>
          <div className="h-px bg-gray-100 flex-1"></div>
        </div>
        <div className="flex items-center gap-4 text-left">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-3xl font-black">
            {datosTurno?.hora.slice(0, 2)}
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">
              Hoy a las {datosTurno?.hora.slice(0, 5)} hs
            </p>
            <p className="text-xs text-gray-500">Seña abonada: $2.000</p>
          </div>
        </div>
      </div>

      {/* BOTÓN DE ACCIÓN PRINCIPAL (VOLVER AL INICIO) */}
      <div className="pt-4 space-y-4">
        <button
          onClick={() => router.push("/")}
          className="w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 bg-black hover:scale-[1.02] active:scale-95"
        >
          VOLVER AL INICIO
          <span className="text-xl">🏠</span>
        </button>
        <p className="text-[10px] text-center text-gray-400 font-medium max-w-xs mx-auto">
          Ya puedes cerrar esta ventana. Te esperamos en la barbería 5 minutos
          antes de tu turno.
        </p>
      </div>
    </div>
  );
}

// --- CONTENEDOR PRINCIPAL CON SUSPENSE (SuccessPage) ---
export default function SuccessPage() {
  return (
    <div className="flex items-center max-w-md mx-auto min-h-screen bg-white p-6 pt-16 pb-24 text-center">
      {/* Fallback de Suspense Boundary (obligatorio para useSearchParams) */}
      <Suspense
        fallback={
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mt-20"></div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}