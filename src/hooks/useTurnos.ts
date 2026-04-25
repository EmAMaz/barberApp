import useSWR from "swr";
import { createClient } from "@supabase/supabase-js";
import { fetchTurnosHoy } from "@/utils/fetchers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useTurnos(agendaId: string) {
  const hoy = new Date().toLocaleDateString("sv-SE");

  const { data, mutate, isLoading, error } = useSWR(
    agendaId ? `turnos/${agendaId}/${hoy}` : null,
    async () => {
      const { data, error } = await supabase
        .from("turnos")
        .select("id, hora, esta_disponible")
        .eq("agenda_id", agendaId)
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

export function useTurnosHoy(perfilId: string) {
  const { data, error, mutate, isLoading } = useSWR(
    perfilId ? `turnos-hoy-${perfilId}` : null, 
    () => fetchTurnosHoy(perfilId), 
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    turnos: data || [],
    isLoading,
    isError: error,
    mutate, // Para actualizar manualmente tras crear la agenda
  };
}