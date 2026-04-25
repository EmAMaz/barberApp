import { useTurnosHoy } from "@/hooks/useTurnos";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

type Props = {
  perfilId: string;
};

export default function VisualizarReservas({ perfilId }: Props) {
  const [mostrarReservas, setMostrarReservas] = useState(false);
  const { turnos, mutate } = useTurnosHoy(perfilId);

  const toggleTurno = async (id: string, estaDisponible: boolean) => {
    const nuevoEstado = !estaDisponible;
    const { error } = await supabase
      .from("turnos")
      .update({
        esta_disponible: nuevoEstado,
        cliente_nombre: nuevoEstado ? null : "BLOQUEADO POR ADMIN",
      })
      .eq("id", id);

    if (!error) mutate();
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setMostrarReservas(!mostrarReservas)}
        className="w-full cursor-pointer flex justify-between items-center p-5 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-800 shadow-sm"
      >
        <span className="flex items-center gap-2">
          📋 VER TURNOS DE HOY
          <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-full">
            {turnos?.length}
          </span>
        </span>
        <span className="text-gray-400">{mostrarReservas ? "▲" : "▼"}</span>
      </button>

      {mostrarReservas && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          {turnos?.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">
              No hay turnos creados para hoy.
            </p>
          ) : (
            turnos?.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-900">
                    {t.hora.slice(0, 5)} HS
                  </span>
                  <span
                    className={`text-xs font-bold ${t.esta_disponible ? "text-gray-400" : "text-green-600"}`}
                  >
                    {t.esta_disponible
                      ? "DISPONIBLE"
                      : `👤 ${t.cliente_nombre}`}
                  </span>
                </div>

                <button
                  onClick={() => toggleTurno(t.id, t.esta_disponible)}
                  className={`cursor-pointer px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                    t.esta_disponible
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {t.esta_disponible ? "BLOQUEAR" : "LIBERAR"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
