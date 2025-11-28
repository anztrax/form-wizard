import { useQuery } from "@tanstack/react-query";
import { fetchDepartments } from "../api/resourcesApi";
import { SelectOption } from "@/common/components/select";

export function useDepartmentsQuery(searchQuery: string = "", debounceMs: number = 200) {
  const query = useQuery<SelectOption[], Error>({
    queryKey: ["departments", searchQuery],
    queryFn: () => fetchDepartments(searchQuery),
    enabled: true,
  });

  return {
    departments: query.data ?? [],
    isLoading: query.isLoading,
  };
}
