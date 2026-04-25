// components/public/BookingFlow.tsx
"use client"
import { useState } from "react";
import { Calendar, Clock, ChevronRight, User } from "@deemlol/next-icons";

export default function BookingFlow({ agendaId }: { agendaId: string }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 pb-32">
      
      {/* Paso 1: Selección de Día */}
      <section className={`transition-all duration-500 ${step > 1 ? 'opacity-50 pointer-events-none scale-95' : 'opacity-100'}`}>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">1</span>
          <h3 className="font-black uppercase tracking-tight text-sm">Seleccioná el día</h3>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {["Lun 06", "Mar 07", "Mie 08", "Jue 09"].map((dia) => (
            <button 
              key={dia}
              onClick={() => { setSelectedDate(dia); setStep(2); }}
              className={`flex-shrink-0 w-24 p-5 rounded-[2rem] border-2 transition-all ${
                selectedDate === dia 
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                : 'border-zinc-100 bg-white dark:bg-zinc-900 dark:border-zinc-800'
              }`}
            >
              <span className="block text-[10px] uppercase font-bold opacity-60 mb-1">{dia.split(' ')[0]}</span>
              <span className="block text-2xl font-black">{dia.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Paso 2: Selección de Hora */}
      {step >= 2 && (
        <section className={`transition-all duration-500 animate-in slide-in-from-bottom-5 ${step > 2 ? 'opacity-50 scale-95' : 'opacity-100'}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">2</span>
            <h3 className="font-black uppercase tracking-tight text-sm">Horarios disponibles</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {["09:00", "10:30", "15:00", "17:30"].map((hora) => (
              <button 
                key={hora}
                onClick={() => { setSelectedTime(hora); setStep(3); }}
                className={`py-4 rounded-2xl font-bold text-sm transition-all ${
                  selectedTime === hora 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {hora}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Paso 3: Datos Finales */}
      {step === 3 && (
        <section className="animate-in fade-in zoom-in duration-500">
           <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">3</span>
            <h3 className="font-black uppercase tracking-tight text-sm">Tus datos</h3>
          </div>
          <div className="space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl">
            <input 
              placeholder="Nombre completo" 
              className="w-full bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
            />
            <input 
              placeholder="WhatsApp" 
              className="w-full bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </section>
      )}

      {/* Botón de Acción Flotante */}
      {step === 3 && (
        <div className="fixed bottom-8 left-0 right-0 px-6 max-w-xl mx-auto">
          <button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-[2rem] font-black text-sm shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
            Confirmar Turno
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}