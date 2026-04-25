// components/public/AgendaCerradaUI.tsx
import { Lock, Instagram, MessageCircle, WhatsApp } from "@deemlol/next-icons";

export default function AgendaCerradaUI({ perfilNombre }: { perfilNombre: any }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
      <div className="w-full max-w-md space-y-8">
        
        {/* Icono de Estado */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-zinc-400">
            <Lock size={32} strokeWidth={1.5} />
          </div>
        </div>

        {/* Mensaje Principal */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
            {perfilNombre}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            La agenda para hoy aún no ha sido publicada. 
            ¡Volvé pronto para asegurar tu lugar!
          </p>
        </div>

        {/* Acciones Alternativas */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">
            Contactate directamente
          </p>
          <div className="flex justify-center gap-4">
            <button className="cursor-pointer p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:scale-105 transition-transform">
              <Instagram size={20} className="text-zinc-600 dark:text-zinc-300" />
            </button>
            <button className="cursor-pointer p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:scale-105 transition-transform">
              <WhatsApp size={20} strokeWidth={1} className="text-zinc-600 dark:text-zinc-300" />
            </button>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 pt-10">
          POWERED BY BARBERFLOW PRO
        </p>
      </div>
    </div>
  );
}