import { PaginatedResponse, PaginationParams } from "../models/CommonApiModel";
import { DetailModel, DetailPayload } from "../models/DetailInfoModel";
import { API_URLS } from "./API_URLS";


export async function fetchDetails(params?: PaginationParams): Promise<PaginatedResponse<DetailModel>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) {
      searchParams.append('_page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('_limit', params.limit.toString());
    }

    const url = `${API_URLS.DETAILS}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch details: ${response.statusText}`);
    }

    const data: DetailModel[] = await response.json();
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
    console.error("Error fetching details:", error);
    throw error;
  }
}

export async function postDetail(data: DetailPayload): Promise<void> {
  try {
    const response = await fetch(`${API_URLS.DETAILS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit detail: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error submitting detail:", error);
    throw error;
  }
}
