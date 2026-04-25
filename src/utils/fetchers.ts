import { supabase } from "@/lib/supabase";

export const fetchTurnosHoy = async (perfilId: string) => {
  const hoy = new Date().toLocaleDateString('sv-SE');
  
  const { data, error } = await supabase
    .from("turnos")
    .select("*, agendas!inner(perfil_id)")
    .eq("fecha", hoy)
    .eq("agendas.perfil_id", perfilId)
    .order("hora", { ascending: true });

  if (error) throw error;
  return data;
};

export const fetchAgenda = async (perfilId: string) => {
  const hoy = new Date().toLocaleDateString('sv-SE');

  const { data, error } = await supabase.from("agendas").select("*").eq("perfil_id", perfilId).eq("fecha_inicio", hoy);

  if (error) throw error;
  return data[0];
};

export const fetchAgendaHoy = async () => {
  const hoy = new Date().toLocaleDateString('sv-SE');

  const { data, error } = await supabase.from("agendas").select("*").eq("fecha_inicio", hoy);

  if (error) throw error;
  return data[0];
};