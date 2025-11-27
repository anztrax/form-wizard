import { useQuery } from "@tanstack/react-query";
import { fetchBasicInfo, PaginatedResponse, BasicInfo } from "../api/basicInfoApi";

export function useBasicInfo() {
  const query = useQuery<PaginatedResponse<BasicInfo>, Error>({
    queryKey: ["basicInfo"],
    queryFn: () => fetchBasicInfo(),
  });

  return {
    count: query.data?.total ?? 0,
  };
}
