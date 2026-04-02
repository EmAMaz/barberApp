import { SignIn } from "@/components/auth-components";
import { FooterHome } from "@/components/footer-components";
import { Scissors } from "@deemlol/next-icons";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans p-6">
      <div className="w-full max-w-100 space-y-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-3">
            <Scissors className="text-white dark:text-black" size={32} />
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
              BarberTurnos
              <span className="text-zinc-400 font-light text-3xl">Pro</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
              Premium Management System
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-100 dark:border-zinc-800">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Bienvenido
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Ingresa para gestionar tus turnos de hoy
            </p>
          </div>

          <div className="space-y-3">
            <SignIn />
            <p className="text-[11px] text-zinc-400 px-4 leading-relaxed">
              Al iniciar sesión, confirmas que eres un barbero autorizado de la plataforma.
            </p>
          </div>
        </div>

        <FooterHome />
      </div>
    </div>
  );
}
