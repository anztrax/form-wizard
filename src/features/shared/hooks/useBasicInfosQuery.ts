import { useQuery } from "@tanstack/react-query";
import { fetchBasicInfos } from "../api/basicInfoApi";
import { PaginatedResponse } from "../models/CommonApiModel";
import { BasicInfoModel } from "../models/BasicInfoModel";

export function useBasicInfosQuery() {
  const query = useQuery<PaginatedResponse<BasicInfoModel>, Error>({
    queryKey: ["basicInfo"],
    queryFn: () => fetchBasicInfos(),
  });

  return {
    count: query.data?.total ?? 0,
  };
}
