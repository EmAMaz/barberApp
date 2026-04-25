// "use client";

// import useSWR from "swr";
// import { useState, useEffect } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { AdminPanelProps } from "@/utils/types";
// import { ModalDefault } from "@/components/ModalDefault";
// import { Button, Modal, useOverlayState } from "@heroui/react";
// import PublishControl from "@/components/PublishControl";

// // Inicialización del cliente de Supabase
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// );

// const fetcher = async (perfilId: string) => {
//   const hoy = new Date().toLocaleDateString('sv-SE');
//   const { data } = await supabase
//     .from("turnos")
//     .select("*")
//     .eq("fecha", hoy)
//     .order("hora", { ascending: true });
//   return data;
// };

// export default function AdminPanel({ perfilId }: AdminPanelProps) {
//   // --- ESTADOS ---
//   // SWR maneja el estado, la carga inicial y el refresco automático
//   const { data: turnosHoy, mutate } = useSWR(perfilId, fetcher, {
//     refreshInterval: 30000, // 🔄 SE ACTUALIZA SOLO CADA 30 SEGUNDOS (Gratis)
//     revalidateOnFocus: true, // 📱 Se actualiza si el barbero vuelve a abrir la pestaña
//   });
//   const [loading, setLoading] = useState(false);
//   //const [turnosHoy, setTurnosHoy] = useState<any[]>([]);
//   const [mostrarReservas, setMostrarReservas] = useState(false);
//   const [editandoConfig, setEditandoConfig] = useState(false);

//   const [isOpen, setIsOpen] = useState(false);
//   const state = useOverlayState();

//   // Configuración de la jornada
//   const [config, setConfig] = useState({
//     inicio: "10:00",
//     fin: "20:00",
//     duracion: 40, // Opciones: 30, 40, 60
//   });

//   // --- LÓGICA DE DATOS ---

//   useEffect(() => {
//     mutate();
//   }, [perfilId]);

//   // Generar la agenda basada en el rango y duración elegida
//  const generarAgendaHoy = async () => {
//   if (!isOpen) return;
//   setLoading(true);

//   try {
//     const hoy = new Date().toLocaleDateString('sv-SE');
//     const nuevosTurnosRaw = [];

//     const [hInicio, mInicio] = config.inicio.split(":").map(Number);
//     const [hFin, mFin] = config.fin.split(":").map(Number);

//     let actualMinutos = hInicio * 60 + mInicio;
//     const finMinutos = hFin * 60 + mFin;

//     while (actualMinutos + config.duracion <= finMinutos) {
//       const h = Math.floor(actualMinutos / 60);
//       const m = actualMinutos % 60;
//       const horaFormateada = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;

//       nuevosTurnosRaw.push({
//         agenda_id: perfilId,
//         fecha: hoy,
//         hora: horaFormateada,
//         esta_disponible: true,
//       });

//       actualMinutos += config.duracion;
//     }

//     // ÚNICO INSERT A LA BASE DE DATOS
//     const { error: errorInsert } = await supabase
//       .from("turnos")
//       .insert(nuevosTurnosRaw);

//     if (errorInsert) {
//       alert("Error: Es posible que los turnos ya existan para hoy.");
//     } else {
//       alert("¡Agenda de hoy publicada con éxito!");
//       setIsOpen(false);
//       setEditandoConfig(false);
//       mutate(); // Actualiza la caché/UI
//     }
//   } catch (err) {
//     console.error("Error inesperado:", err);
//     alert("Ocurrió un error al generar la agenda.");
//   } finally {
//     // Esto garantiza que el loading se apague siempre
//     setLoading(false);
//   }

//   // LAS LÍNEAS QUE ESTABAN AQUÍ FUERON ELIMINADAS
// };

//   return (
//     <div className="p-6 space-y-6">
//       {/* 1. BOTÓN PARA ABRIR CONFIGURACIÓN */}
//       <button
//         onClick={() => setEditandoConfig(!editandoConfig)}
//         className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
//       >
//         {editandoConfig
//           ? "✕ CERRAR CONFIGURACIÓN"
//           : "⚙️ AJUSTAR HORARIOS Y DURACIÓN"}
//       </button>

//       {/* 2. PANEL DE CONFIGURACIÓN (Solo visible si editandoConfig es true) */}
//       {editandoConfig && (
//         <div className="p-5 bg-gray-50 rounded-3xl space-y-5 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
//                 Entrada
//               </label>
//               <input
//                 type="time"
//                 value={config.inicio}
//                 onChange={(e) =>
//                   setConfig({ ...config, inicio: e.target.value })
//                 }
//                 className="w-full p-3 rounded-xl border-none shadow-sm font-bold text-gray-700"
//               />
//             </div>
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
//                 Salida
//               </label>
//               <input
//                 type="time"
//                 value={config.fin}
//                 onChange={(e) => setConfig({ ...config, fin: e.target.value })}
//                 className="w-full p-3 rounded-xl border-none shadow-sm font-bold text-gray-700"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
//               Duración por corte
//             </label>
//             <div className="grid grid-cols-3 gap-2 mt-1">
//               {[30, 40, 60].map((d) => (
//                 <button
//                   key={d}
//                   onClick={() => setConfig({ ...config, duracion: d })}
//                   className={`py-3 rounded-xl text-sm font-bold transition-all ${
//                     config.duracion === d
//                       ? "bg-black text-white shadow-lg scale-105"
//                       : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-100"
//                   }`}
//                 >
//                   {d} min
//                 </button>
//               ))}
//             </div>
//           </div>

//           <button
//             onClick={() => setIsOpen(true)}
//             disabled={loading}
//             className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-blue-200 shadow-lg active:scale-95 transition-all"
//           >
//             {loading ? "GENERANDO..." : "🚀 PUBLICAR AGENDA"}
//           </button>
//         </div>
//       )}

//       <Modal children={<ModalDefault isOpen={isOpen} setIsOpen={setIsOpen} generarAgendaHoy={generarAgendaHoy} config={config} />} />

//       {/* 3. SECCIÓN DE RESERVAS (Colapsable) */}
//       <div className="space-y-3">
//         <button
//           onClick={() => setMostrarReservas(!mostrarReservas)}
//           className="w-full flex justify-between items-center p-5 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-800 shadow-sm"
//         >
//           <span className="flex items-center gap-2">
//             📋 VER TURNOS DE HOY
//             <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-full">
//               {turnosHoy?.length}
//             </span>
//           </span>
//           <span className="text-gray-400">{mostrarReservas ? "▲" : "▼"}</span>
//         </button>

//         <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors" onClick={compartirAgenda}>Compartir la agenda</button>
//         {mostrarReservas && (
//           <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
//             {turnosHoy?.length === 0 ? (
//               <p className="text-center py-10 text-gray-400 text-sm">
//                 No hay turnos creados para hoy.
//               </p>
//             ) : (
//               turnosHoy?.map((t) => (
//                 <div
//                   key={t.id}
//                   className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
//                 >
//                   <div className="flex flex-col">
//                     <span className="text-sm font-black text-gray-900">
//                       {t.hora.slice(0, 5)} HS
//                     </span>
//                     <span
//                       className={`text-xs font-bold ${t.esta_disponible ? "text-gray-400" : "text-green-600"}`}
//                     >
//                       {t.esta_disponible
//                         ? "DISPONIBLE"
//                         : `👤 ${t.cliente_nombre}`}
//                     </span>
//                   </div>

//                   <button
//                     onClick={() => toggleTurno(t.id, t.esta_disponible)}
//                     className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
//                       t.esta_disponible
//                         ? "bg-red-50 text-red-500 hover:bg-red-100"
//                         : "bg-green-50 text-green-600 hover:bg-green-100"
//                     }`}
//                   >
//                     {t.esta_disponible ? "BLOQUEAR" : "LIBERAR"}
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminPanelProps } from "@/utils/types";
import { ModalDefault } from "@/components/ModalDefault";
import { Modal } from "@heroui/react";
import { useTurnosHoy } from "@/hooks/useTurnos";
import VisualizarReservas from "@/components/VisualizarReservas";
import AgendaUI from "@/components/AgendaUI";
import { useAgenda } from "@/hooks/useAgenda";

export default function AdminPanel({ perfilId }: AdminPanelProps) {
  const { turnos, mutate, isLoading } = useTurnosHoy(perfilId);
  const { agenda, mutate: mutateAgenda } = useAgenda(perfilId);
  const [loading, setLoading] = useState(false);
  const [editandoConfig, setEditandoConfig] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [config, setConfig] = useState({
    inicio: "10:00",
    fin: "20:00",
    duracion: 40,
  }); 

  const generarAgendaHoy = async () => {
    if (!isOpen) return;
    setLoading(true);

    try {
      const hoy = new Date().toLocaleDateString("sv-SE");

      // 1. CREAR LA AGENDA PRIMERO
      const { data: nuevaAgenda, error: errorAgenda } = await supabase
        .from("agendas")
        .insert([
          {
            perfil_id: perfilId,
            estado: "activa",
            fecha_inicio: hoy,
            config: {
              duracion_corte: config.duracion,
              rango: { inicio: config.inicio, fin: config.fin },
              creado_el: hoy,
            },
          },
        ])
        .select()
        .single();

      if (errorAgenda)
        throw new Error("No se pudo crear la cabecera de la agenda.");

      // 2. GENERAR TURNOS LOCALMENTE
      const nuevosTurnosRaw = [];
      const [hInicio, mInicio] = config.inicio.split(":").map(Number);
      const [hFin, mFin] = config.fin.split(":").map(Number);

      let actualMinutos = hInicio * 60 + mInicio;
      const finMinutos = hFin * 60 + mFin;

      while (actualMinutos + config.duracion <= finMinutos) {
        const h = Math.floor(actualMinutos / 60);
        const m = actualMinutos % 60;
        const horaFormateada = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;

        nuevosTurnosRaw.push({
          agenda_id: nuevaAgenda.id, // <--- Vinculamos al ID de la agenda recién creada
          fecha: hoy,
          hora: horaFormateada,
          esta_disponible: true,
        });

        actualMinutos += config.duracion;
      }

      // 3. INSERTAR TODOS LOS TURNOS
      const { error: errorTurnos } = await supabase
        .from("turnos")
        .insert(nuevosTurnosRaw);

      if (errorTurnos) {
        // Opcional: Borrar la agenda si los turnos fallan (Rollback manual)
        await supabase.from("agendas").delete().eq("id", nuevaAgenda.id);
        alert("Error al generar los turnos individuales.");
      } else {
        alert("🚀 ¡Jornada publicada y turnos generados!");
        setIsOpen(false);
        setEditandoConfig(false);
        mutate();
        mutateAgenda();
      }
    } catch (err: any) {
      alert(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
    mutate();
  };

  return (
    <div>
      {/* Botón de configuración con estilo minimalista */}

      {agenda.length <= 0 ? (
        <button
          onClick={() => setEditandoConfig(!editandoConfig)}
          className="w-full cursor-pointer py-4 my-4 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 font-bold text-xs tracking-widest hover:bg-neutral-50 hover:text-neutral-600 transition-all uppercase"
        >
          {editandoConfig
            ? "✕ Cancelar Ajustes"
            : "⚙️ Configurar Jornada de Hoy"}
        </button>
      ) : (
        <AgendaUI agendas={agenda} />
      )}

      {/* Panel de Configuración */}
      {editandoConfig && (
        <div className="p-6 bg-white rounded-[2.5rem] space-y-6 border border-neutral-100 shadow-xl shadow-neutral-100/50 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter ml-1">
                Apertura
              </label>
              <input
                type="time"
                value={config.inicio}
                onChange={(e) =>
                  setConfig({ ...config, inicio: e.target.value })
                }
                className="w-full p-4 rounded-2xl bg-neutral-50 border-none font-bold text-neutral-800 focus:ring-2 focus:ring-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter ml-1">
                Cierre
              </label>
              <input
                type="time"
                value={config.fin}
                onChange={(e) => setConfig({ ...config, fin: e.target.value })}
                className="w-full p-4 rounded-2xl bg-neutral-50 border-none font-bold text-neutral-800 focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter ml-1">
              Duración del Turno
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[30, 40, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setConfig({ ...config, duracion: d })}
                  className={`cursor-pointer py-4 rounded-2xl text-xs font-black transition-all ${
                    config.duracion === d
                      ? "bg-black text-white shadow-lg shadow-neutral-200"
                      : "bg-neutral-50 text-neutral-400 border border-neutral-100 hover:bg-neutral-100"
                  }`}
                >
                  {d} MIN
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            disabled={loading}
            className="w-full cursor-pointer py-5 bg-black text-white rounded-2xl font-black text-sm tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-neutral-200"
          >
            {loading ? "GENERANDO..." : "PUBLICAR AGENDA"}
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={isOpen}
        children={
          <ModalDefault
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            generarAgendaHoy={generarAgendaHoy}
            config={config}
          />
        }
      />

      {/* 3. SECCIÓN DE RESERVAS (Colapsable) */}
      <VisualizarReservas perfilId={perfilId} />
    </div>
  );
}
