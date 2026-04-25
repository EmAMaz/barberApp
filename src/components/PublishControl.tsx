"use client"
import { useState } from "react"
import { Globe, Lock, CheckCircle } from "@deemlol/next-icons"

export default function PublishControl({ agendaId, estadoInicial }: { agendaId: string, estadoInicial: string }) {
  const [estado, setEstado] = useState(estadoInicial)

  const togglePublicacion = async (nuevoEstado: string) => {
    // 1. Update en Supabase: .from('agendas').update({ estado: nuevoEstado }).eq('id', agendaId)
    setEstado(nuevoEstado)
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-zinc-800 dark:text-zinc-100 uppercase text-xs tracking-widest">
          Estado de la Agenda
        </h3>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
          estado === 'publicada' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-500'
        }`}>
          {estado === 'publicada' ? 'En Línea' : 'Privado'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => togglePublicacion('borrador')}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
            estado === 'borrador' ? 'border-zinc-900 bg-zinc-50' : 'border-transparent bg-zinc-100/50'
          }`}
        >
          <Lock size={20} />
          <span className="text-[10px] font-bold">PAUSAR</span>
        </button>

        <button 
          onClick={() => togglePublicacion('publicada')}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
            estado === 'publicada' ? 'border-green-500 bg-green-50' : 'border-transparent bg-zinc-100/50'
          }`}
        >
          <Globe size={20} className={estado === 'publicada' ? 'text-green-600' : ''} />
          <span className="text-[10px] font-bold text-zinc-800">PUBLICAR</span>
        </button>
      </div>
    </div>
  )
}