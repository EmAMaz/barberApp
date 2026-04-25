import { fetchAgendaHoy } from "@/utils/fetchers";
import useSWR from "swr";

export function useGetAgenda() {
  const { data, error, mutate, isLoading } = useSWR(
    "agendas",
    () => fetchAgendaHoy(),
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    },
  );
  return {
    agenda: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
