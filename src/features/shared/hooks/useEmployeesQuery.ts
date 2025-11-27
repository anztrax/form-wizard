import { useQueries } from "@tanstack/react-query";
import { fetchBasicInfo, PaginatedResponse, BasicInfo } from "../api/basicInfoApi";
import { fetchDetails, Details } from "../api/detailsApi";

export type PaginationParams = {
  _page?: number;
  _limit?: number;
};

export type EmployeesData = {
  basicInfo: PaginatedResponse<BasicInfo> | undefined;
  details: PaginatedResponse<Details> | undefined;
};

export function useEmployeesQuery(params?: PaginationParams) {
  return useQueries({
    queries: [
      {
        queryKey: ['basicInfo', params],
        queryFn: async () => {
          const response = await fetchBasicInfo(params);
          return response;
        },
      },
      {
        queryKey: ['details', params],
        queryFn: async () => {
          const response = await fetchDetails(params);
          return response;
        },
      },
    ],
    combine: (results) => {
      const [basicInfoResult, detailsResult] = results;

      return {
        data: {
          basicInfo: basicInfoResult.data,
          details: detailsResult.data,
        },
        isPending: basicInfoResult.isPending || detailsResult.isPending,
        isLoading: basicInfoResult.isLoading || detailsResult.isLoading,
        isError: basicInfoResult.isError || detailsResult.isError,
        isSuccess: basicInfoResult.isSuccess && detailsResult.isSuccess,
        error: basicInfoResult.error || detailsResult.error,
        refetch: () => {
          basicInfoResult.refetch();
          detailsResult.refetch();
        },
      };
    },
  });
}
