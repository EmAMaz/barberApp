"use client";

import { supabase } from "@/lib/supabase";
import {
  Calendar,
  Clock,
  Power,
  ChevronRight,
  Settings,
} from "@deemlol/next-icons";
import { useAgenda } from "@/hooks/useAgenda";

export default function AgendaUI({ agendas }: { agendas: any }) {
  const { agenda, mutate, isLoading } = useAgenda(agendas.perfil_id);

  const toggleEstado = async () => {
    const nuevoEstado = agenda.estado === "activa" ? "pausada" : "activa";

    const { error } = await supabase
      .from("agendas")
      .update({ estado: nuevoEstado })
      .eq("id", agenda.id);

    if (!error) mutate();

  };

  if (!agendas) return null;

  const { duracion_corte, rango } = agendas.config || {};

  return (
    <div className="w-full max-w-md mx-auto group px-2 sm:px-0 my-5">
      <div className="bg-white border border-neutral-100 rounded-[2rem] sm:rounded-[2.5rem] sm:p-2 shadow-xl shadow-neutral-100/40 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500">
        <div className="bg-neutral-50 rounded-[1.7rem] sm:rounded-[2rem] p-4 sm:p-6">
          {/* Header: Stackeado en mobile muy pequeño, flex en el resto */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-neutral-100 shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[11px] sm:text-[13px] font-black uppercase tracking-widest text-neutral-400 truncate">
                  Jornada Actual
                </h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-900 truncate">
                  Configuración de turnos
                </p>
              </div>
            </div>

            <button
              onClick={toggleEstado}
              disabled={isLoading}
              className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border self-end sm:self-auto ${
                agendas.estado === "activa"
                  ? "bg-green-50 border-green-100 text-green-600"
                  : "bg-neutral-100 border-neutral-200 text-neutral-500"
              }`}
            >
              <Power
                className={`w-3 h-3 ${isLoading ? "animate-pulse" : ""}`}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isLoading ? "..." : agendas.estado}
              </span>
            </button>
          </div>

          {/* Grid de Detalles: 1 columna en mobile muy pequeño, 2 en el resto */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-100/50 shadow-sm flex flex-row xs:flex-col items-center xs:items-start gap-3 xs:gap-2">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <span className="block text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase leading-none mb-1">
                  Duración
                </span>
                <span className="text-base sm:text-lg font-black text-neutral-900">
                  {duracion_corte} min
                </span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-100/50 shadow-sm flex flex-row xs:flex-col items-center xs:items-start gap-3 xs:gap-2">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <span className="block text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase leading-none mb-1">
                  Horario
                </span>
                <span className="text-base sm:text-lg font-black text-neutral-900">
                  {rango?.inicio} — {rango?.fin}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Acción Secundario */} {/* TODO: Implementar a futuro */}
          {/* <button className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-white rounded-xl sm:rounded-2xl border border-neutral-100 group/btn active:scale-[0.98] sm:hover:border-neutral-900 transition-all duration-300">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-neutral-400 group-hover/btn:text-neutral-900 transition-colors" />
              <span className="text-[11px] sm:text-xs font-bold text-neutral-600 group-hover/btn:text-neutral-900">
                Modificar parámetros
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover/btn:translate-x-1 transition-all" />
          </button> */}
        </div>
      </div>
    </div>
  );
}
