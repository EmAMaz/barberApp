"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fetcher = async ({ barberoId }: { barberoId: string }) => {
  const hoy = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('turnos')
    .select('id, hora, esta_disponible')
    .eq('barbero_id', barberoId)
    .eq('fecha', hoy)
    .order('hora', { ascending: true });
  return data;
};

// --- SUB-COMPONENTE SKELETON (La carga elegante) ---
function SkeletonLoader() {
  return (
    <div className="grid grid-cols-3 gap-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-14 bg-gray-200 rounded-2xl"></div>
      ))}
    </div>
  );
}

export default function BookingUI({ barbero }: any) {
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: turnos, mutate, isLoading } = useSWR(
    { barberoId: barbero.id }, 
    fetcher, 
    { 
      refreshInterval: 15000,
      revalidateOnFocus: true 
    }
  );

  const handleConfirmar = async () => {
    if (!selectedTurno || !nombre) return alert("Escribe tu nombre");
    setLoading(true);

    const { data: check } = await supabase
      .from('turnos')
      .select('esta_disponible')
      .eq('id', selectedTurno.id)
      .single();

    if (!check?.esta_disponible) {
      alert("¡Llegaste tarde! Este turno ya se reservó.");
      setSelectedTurno(null);
      mutate();
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('turnos')
      .update({ esta_disponible: false, cliente_nombre: nombre })
      .eq('id', selectedTurno.id);

    if (!error) {
      mutate();
      const texto = `Hola! Soy ${nombre}, reservé a las ${selectedTurno.hora.slice(0, 5)}hs.`;
      window.location.href = `https://wa.me/${barbero.telefono_whatsapp}?text=${encodeURIComponent(texto)}`;
    }
    setLoading(false);
  };

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
          <div className="grid grid-cols-3 gap-3">
            {turnos?.map((t: any) => (
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
                  <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">LIBRE</span>
                )}
              </button>
            ))}
          </div>
        )}
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
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between px-2">
              <p className="text-sm font-bold text-gray-500">Reserva para las <span className="text-black">{selectedTurno.hora.slice(0,5)} hs</span></p>
              <button onClick={() => setSelectedTurno(null)} className="text-xs text-red-500 font-bold uppercase">Cancelar</button>
            </div>
            
            <input
              type="text"
              placeholder="Escribe tu nombre completo"
              className="w-full bg-gray-100 p-5 rounded-2xl text-lg font-bold border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            
            <button
              onClick={handleConfirmar}
              disabled={loading || !nombre}
              className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${
                !nombre ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-black"
              }`}
            >
              {loading ? "RESERVANDO..." : "RESERVAR AHORA"}
              <span className="text-xl">👉</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}