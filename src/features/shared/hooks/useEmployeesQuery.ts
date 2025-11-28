import { useQueries } from "@tanstack/react-query";
import { fetchBasicInfos } from "../api/basicInfoApi";
import { fetchDetails } from "../api/detailsApi";
import { EmployeeModel } from "../models/EmployeeModel";
import { DetailModel } from "../models/DetailInfoModel";
import { PaginatedResponse } from "../models/CommonApiModel";
import { BasicInfoModel } from "../models/BasicInfoModel";

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type EmployeesData = {
  basicInfo: PaginatedResponse<BasicInfoModel> | undefined;
  details: PaginatedResponse<DetailModel> | undefined;
};

function combineData(
  basicInfo: BasicInfoModel[],
  details: DetailModel[]
): Array<EmployeeModel> {
  const normalizedValue = (value: string | null | undefined): string => {
    return value && value.trim() !== '' ? value : 'N/A';
  }

  const getKey = (id?: string | null, email?: string | null): string | null => {
    const idKey = id?.trim();
    const emailKey = email?.trim();
    return idKey && emailKey ? `${idKey}#${emailKey}` : null;
  };

  const detailsMap = new Map<string, DetailModel>();
  const detailOnly: DetailModel[] = [];
  details.forEach((detail) => {
    const key = getKey(detail?.employeeId, detail?.email);
    key ? detailsMap.set(key, detail) : detailOnly.push(detail);
  });

  const employees: EmployeeModel[] = [];

  basicInfo.forEach((basicInfoData) => {
    const key = getKey(basicInfoData.employeeId, basicInfoData.email);
    const detailData = detailsMap.get(key || '');
    if (key && detailData) {
      employees.push({
        fullName: normalizedValue(basicInfoData.fullName),
        department: normalizedValue(basicInfoData.departmentName),
        role: normalizedValue(basicInfoData.role),
        location: normalizedValue(detailData?.locationName),
        photo: detailData?.photo,
      });
      detailsMap.delete(key);
    }
  });

  if (detailOnly.length > 0) {
    detailOnly.forEach((detailData) => {
      employees.push({
        fullName: 'N/A',
        department: 'N/A',
        role: 'N/A',
        location: normalizedValue(detailData?.locationName),
        photo: detailData?.photo,
      });
    });
  }

  return employees;
}

export function useEmployeesQuery(params?: PaginationParams) {
  return useQueries({
    queries: [
      {
        queryKey: ['basicInfo', params],
        queryFn: async () => {
          const response = await fetchBasicInfos(params);
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
      const employees = combineData(
        basicInfoResult.data?.data || [],
        detailsResult.data?.data || []
      );

      return {
        data: {
          details: detailsResult.data,
          employees
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
