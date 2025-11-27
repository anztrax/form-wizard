const API_BASE_URL_LOCATIONS = "http://localhost:4002";

export type Details = {
  id: string;
  photo: string;
  employmentType: string;
  location: string;
  notes?: string;
};

export type DetailsPayload = {
  photo: string;
  employmentType: string;
  location: string;
  notes?: string;
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

export async function fetchDetails(params?: PaginationParams): Promise<PaginatedResponse<Details>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?._page) {
      searchParams.append('_page', params._page.toString());
    }
    if (params?._limit) {
      searchParams.append('_limit', params._limit.toString());
    }

    const url = `${API_BASE_URL_LOCATIONS}/details${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch details: ${response.statusText}`);
    }

    const data: Details[] = await response.json();
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
    console.error("Error fetching details:", error);
    throw error;
  }
}

export async function postDetails(data: DetailsPayload): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL_LOCATIONS}/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit details: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error submitting details:", error);
    throw error;
  }
}
