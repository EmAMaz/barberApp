import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session) redirect("/");

  // 1. Instanciar Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: negocio } = await supabase.from("perfiles_negocio")
  .select("*")
  .eq("owner_email", session?.user?.email);

  if (negocio && negocio.length > 0) {
    redirect("/admin/" + negocio[0].slug);
  }

  async function registrarNegocio(formData: FormData) {
    "use server";
    const nombre = formData.get("nombre") as string;
    const tel = formData.get("telefono") as string;

    // 1. Instanciar Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // 2. Insertar datos
    const { error } = await supabase.from("perfiles_negocio").insert([
      {
        owner_email: session?.user?.email,
        display_name: nombre,
        category: "Barberia",
        slug: nombre.toLowerCase().replace(/ /g, "-"),
        telefono_whatsapp: tel,
      },
    ]);

    if (!error) redirect("/admin/" + nombre.toLowerCase().replace(/ /g, "-"));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="w-full max-w-[450px] space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
            Casi listo...
          </h1>
          <p className="text-zinc-500 text-sm">
            Configura tu perfil profesional para empezar
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] shadow-xl border border-zinc-100 dark:border-zinc-800">
          <form action={registrarNegocio} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-2">
                Nombre del Negocio
              </label>
              <input
                name="nombre"
                required
                placeholder="Ej. Barbería Santiago"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
              />
            </div>

            {/* Por ahora no es necesario */}
            {/* <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-2">
                Rubro del Negocio
              </label>
              <select
                name="category"
                className="cursor-pointer w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl py-4 px-6 appearance-none outline-none font-bold text-sm"
              >
                <option value="barberia">Barbería / Peluquería</option>
                <option value="estetica">Estética y Spa</option>
                <option value="salud">Consultorio Médico</option>
                <option value="otros">Otros Servicios</option>
              </select>
            </div> */}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-2">
                Teléfono de contacto
              </label>
              <input
                name="telefono"
                required
                type="tel"
                placeholder="+54 11 ..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg mt-4"
            >
              Crear mi Panel Profesional
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
