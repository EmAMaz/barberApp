// app/admin/[slug]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import AdminPanel from "./AdminPanel";
import { auth, signOut } from "@/auth";
import { FooterAdmin } from "@/components/footer-components";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function AdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session) {
    return redirect("/");
  }
  const { data: barbero } = await supabase
    .from("barberos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!barbero) return notFound();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        {/* Header con estilo Bento Dark */}
        <div className="bg-black p-8 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-60 mb-1">
                Admin Panel
              </p>
              <h1 className="text-2xl font-bold tracking-tight">
                {barbero.nombre_negocio}
              </h1>
            </div>

            {/* Botón Cerrar Sesión Estilizado */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md border border-white/10 cursor-pointer">
                Cerrar Sesión
              </button>
            </form>
          </div>

          <div className="mt-6">
            <p className="text-gray-400">Bienvenido,</p>
            <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
          </div>
        </div>

        {/* Cuerpo del Panel */}
        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
              Gestión de Turnos
            </h3>
            <AdminPanel barberoId={barbero.id} />
          </section>

          <hr className="border-gray-100" />

          {/* Sección de Configuración Crítica */}
          <section className="bg-red-50/50 rounded-2xl p-5 border border-red-100">
            <div className="flex items-center gap-2 text-red-600 mb-3">
              <h3 className="font-bold text-sm uppercase tracking-wider">
                Configuración Avanzada
              </h3>
            </div>

            <p className="text-xs text-red-700/70 mb-4">
              ¿Formato de horarios incorrecto? Esta acción eliminará **todos**
              los turnos actuales para que puedas recrearlos desde cero.
            </p>

            <form
              action={async () => {
                "use server";
                // Aquí llamarías a tu función de base de datos:
                // await deleteManyTurnos(barberoId)
                console.log("Limpiando turnos...");
              }}
            >
              <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-200 transition-all py-3 rounded-xl text-sm font-bold shadow-sm">
                Reiniciar Todos los Turnos
              </button>
            </form>
          </section>
        </div>

        <FooterAdmin />
      </div>
    </div>
  );
}
