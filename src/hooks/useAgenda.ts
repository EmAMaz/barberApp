import { fetchAgenda } from "@/utils/fetchers";
import useSWR from "swr";

export function useAgenda(perfilId: string) {
  const { data, error, mutate, isLoading } = useSWR(
    "agendas",
    () => fetchAgenda(perfilId),
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
