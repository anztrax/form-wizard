import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "../api/resourcesApi";
import { SelectOption } from "@/common/components/select";

export function useLocationsQuery(searchQuery: string = "") {
  const query = useQuery<SelectOption[], Error>({
    queryKey: ["locations", searchQuery],
    queryFn: () => fetchLocations(searchQuery),
  });

  return {
    locations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
