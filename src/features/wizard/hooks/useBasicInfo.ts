import { useQuery } from "@tanstack/react-query";
import { fetchBasicInfo, BasicInfo } from "../api/basicInfo";

export function useBasicInfo() {
  const query = useQuery<BasicInfo[], Error>({
    queryKey: ["basicInfo"],
    queryFn: fetchBasicInfo,
  });

  return {
    count: query.data?.length ?? 0,
  };
}
