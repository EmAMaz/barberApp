"use client";

import { useMemo, useState } from "react";
import CheckoutButton from "@/components/WalletMp";
import { useTurnos } from "@/hooks/useTurnos";
import SkeletonLoader from "@/utils/SkeletonLoader";

export default function BookingUI({ barbero }: any) {
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const { turnos, mutate, isLoading, supabase } = useTurnos(barbero.id);

  const handleConfirmar = async () => {
    if (!selectedTurno || !nombre) return alert("Escribe tu nombre");
    setLoading(true);

    try {
      const { data: check } = await supabase
        .from("turnos")
        .select("esta_disponible")
        .eq("id", selectedTurno.id)
        .single();

      if (!check?.esta_disponible) {
        alert("¡Llegaste tarde! Este turno ya se reservó.");
        setSelectedTurno(null);
        mutate(); // SWR actualiza la lista sin recargar la página
        return;
      }

      const { error } = await supabase
        .from("turnos")
        .update({ esta_disponible: false, cliente_nombre: nombre })
        .eq("id", selectedTurno.id);

      if (!error) {
        mutate();
        const texto = `Hola! Soy ${nombre}, reservé a las ${selectedTurno.hora.slice(0, 5)}hs.`;
        window.location.href = `https://wa.me/${barbero.telefono_whatsapp}?text=${encodeURIComponent(texto)}`;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const listaTurnos = useMemo(() => {
    return turnos?.map((t: any) => (
      <button
        key={t.id}
        disabled={!t.esta_disponible}
        onClick={() => setSelectedTurno(t)}
        className={`group relative h-16 rounded-2xl font-black transition-all border-2 flex flex-col items-center justify-center ${
          !t.esta_disponible
            ? "bg-gray-50 border-transparent text-gray-300 opacity-40 cursor-not-allowed"
            : selectedTurno?.id === t.id
              ? "bg-black text-white border-black shadow-2xl scale-105 z-10"
              : "bg-white border-gray-100 text-gray-800 hover:border-black active:scale-95"
        }`}
      >
        <span className="text-lg">{t.hora.slice(0, 5)}</span>
        {t.esta_disponible && selectedTurno?.id !== t.id && (
          <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
            LIBRE
          </span>
        )}
      </button>
    ));
  }, [turnos, selectedTurno?.id]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white p-6 pb-24">
      {/* CABECERA ESTILO PREMIUM */}
      <header className="text-center mb-10">
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-xl">
          {barbero.nombre_negocio.charAt(0)}
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
          {barbero.nombre_negocio}
        </h1>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Agenda abierta hoy
          </p>
        </div>
      </header>

      {/* CUERPO: SKELETON O TURNOS */}
      <section>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-3 gap-3">{listaTurnos}</div>
        )}
      </section>
      <section>
        {!isLoading && !turnos?.length && (
          <p className="mt-4 text-center text-gray-500">
            Ups...
            <br />
            No hay turnos disponibles
          </p>
        )}
      </section>

      {/* FOOTER FLOTANTE PARA CONFIRMACIÓN */}
      {selectedTurno && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-gray-100 animate-in slide-in-from-bottom-full duration-500 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-md mx-auto space-y-4">
            {/* HEADER DEL FOOTER */}
            <div className="flex items-center justify-between px-1">
              <div className="flex flex-col">
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                  Confirmar Turno
                </p>
                <p className="text-sm font-bold text-black">
                  {selectedTurno.hora.slice(0, 5)} hs{" "}
                  <span className="text-gray-400 mx-1">•</span>{" "}
                  <span className="text-green-600">Seña Requerida</span>
                </p>
              </div>
              <button
                onClick={() => {
                  (setSelectedTurno(null), setNombre(""));
                }}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* AVISO DE SEÑA - Diseño Atractivo */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm text-2xl">
                💳
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-green-800 uppercase tracking-tight">
                  Reserva con Seña
                </p>
                <p className="text-[11px] text-green-700 leading-tight">
                  Para congelar tu turno debes abonar una seña de{" "}
                  <span className="font-bold">$2.000</span> mediante Mercado
                  Pago.
                </p>
              </div>
            </div>

            {/* INPUT DE NOMBRE */}
            <div className="relative">
              <input
                type="text"
                placeholder="Escribe tu nombre completo"
                className="w-full bg-gray-50 p-5 rounded-2xl text-lg font-bold border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {nombre && (
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in">
                  ✓
                </span>
              )}
            </div>

            {/* ESPACIO PARA TU COMPONENTE DE PAGO O BOTÓN DE ACCIÓN */}
            <div className="pt-2">
              {!nombre ? (
                // Botón deshabilitado estético mientras no hay nombre
                <button
                  disabled
                  className="w-full py-5 rounded-2xl font-black text-white bg-gray-200 cursor-not-allowed flex items-center justify-center gap-3"
                >
                  INGRESA TU NOMBRE
                </button>
              ) : (
                /* AQUÍ VA TU COMPONENTE CON LA LÓGICA DE MERCADO PAGO */
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <CheckoutButton turnoId={selectedTurno.id} nombre={nombre} precio={100} />
                </div>
              )}
            </div>

            <p className="text-[10px] text-center text-gray-400 font-medium">
              Pago procesado de forma segura por Mercado Pago
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
