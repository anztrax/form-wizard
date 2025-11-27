const API_BASE_URL = "http://localhost:4001";

export type BasicInfo = {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
};

export type PaginationParams = {
  _page?: number;
  _limit?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchBasicInfo(params?: PaginationParams): Promise<PaginatedResponse<BasicInfo>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?._page) {
      searchParams.append('_page', params._page.toString());
    }
    if (params?._limit) {
      searchParams.append('_limit', params._limit.toString());
    }

    const url = `${API_BASE_URL}/basicInfo${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch basic info: ${response.statusText}`);
    }

    const data: BasicInfo[] = await response.json();
    const totalCount = response.headers.get('X-Total-Count');
    const total = totalCount ? parseInt(totalCount) : data.length;
    const page = params?._page || 1;
    const limit = params?._limit || total;

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

export type BasicInfoPayload = {
  fullName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
};

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
