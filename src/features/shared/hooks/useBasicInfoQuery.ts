import { useQuery } from "@tanstack/react-query";
import { fetchBasicInfo, PaginationParams } from "../api/basicInfoApi";

export const BASIC_INFO_QUERY_KEY = "basicInfo";

export function useBasicInfoQuery(params?: PaginationParams) {
  return useQuery({
    queryKey: [BASIC_INFO_QUERY_KEY, params],
    queryFn: () => fetchBasicInfo(params),
  });
}
