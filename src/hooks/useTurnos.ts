import useSWR from "swr";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useTurnos(barberoId: string) {
  const hoy = new Date().toLocaleDateString("sv-SE");

  const { data, mutate, isLoading, error } = useSWR(
    barberoId ? `turnos/${barberoId}/${hoy}` : null, // Key única por barbero y día
    async () => {
      const { data, error } = await supabase
        .from("turnos")
        .select("id, hora, esta_disponible")
        .eq("barbero_id", barberoId)
        .eq("fecha", hoy)
        .order("hora", { ascending: true });

      if (error) throw error;
      return data;
    },
    {
      refreshInterval: 15000,
      revalidateOnFocus: true,
    }
  );

  return {
    turnos: data,
    mutate,
    isLoading,
    isError: error,
    supabase, // Lo exportamos para usarlo en el handleConfirmar
  };
}