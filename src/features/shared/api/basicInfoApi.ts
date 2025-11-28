import {
  BasicInfoModel,
  BasicInfoPayload
} from "../models/BasicInfoModel";
import {
  PaginatedResponse,
  PaginationParams
} from "../models/CommonApiModel";

const API_BASE_URL = "http://localhost:4001";


export async function fetchBasicInfos(params?: PaginationParams): Promise<PaginatedResponse<BasicInfoModel>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) {
      searchParams.append('_page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('_limit', params.limit.toString());
    }

    const url = `${API_BASE_URL}/basicInfo${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch basic info: ${response.statusText}`);
    }

    const data: BasicInfoModel[] = await response.json();
    const totalCount = response.headers.get('X-Total-Count');
    const total = totalCount ? parseInt(totalCount) : data.length;
    const page = params?.page || 1;
    const limit = params?.limit || total;

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching basic info:", error);
    throw error;
  }
}


export async function postBasicInfo(data: BasicInfoPayload): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/basicInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit basic info: ${response.statusText}`);
    }

  } catch (error) {
    console.error("Error submitting basic info:", error);
    throw error;
  }
}
