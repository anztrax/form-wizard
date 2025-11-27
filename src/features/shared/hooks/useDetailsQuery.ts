import { useQuery } from "@tanstack/react-query";
import { fetchDetails, PaginationParams } from "../api/detailsApi";

export const DETAILS_QUERY_KEY = "details";

export function useDetailsQuery(params?: PaginationParams) {
  return useQuery({
    queryKey: [DETAILS_QUERY_KEY, params],
    queryFn: () => fetchDetails(params),
  });
}
