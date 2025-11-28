import { SelectOption } from "@/common/components/select";

const API_BASE_URL = "http://localhost:4001";
const API_BASE_URL_LOCATIONS = "http://localhost:4002";

export type Department = {
  id: string;
  name: string;
};

export type Location = {
  id: string;
  name: string;
};

export async function fetchDepartments(
  searchQuery?: string
): Promise<SelectOption[]> {
  try {
    const url = new URL(`${API_BASE_URL}/departments`);

    if (searchQuery) {
      url.searchParams.append("name_like", searchQuery);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.statusText}`);
    }

    const data: Department[] = await response.json();

    return data.map((dept) => ({
      value: `${dept.id}`,
      label: dept.name,
    }));
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
}

export async function fetchLocations(
  searchQuery?: string
): Promise<SelectOption[]> {
  try {
    const url = new URL(`${API_BASE_URL_LOCATIONS}/locations`);

    if (searchQuery) {
      url.searchParams.append("name_like", searchQuery);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data: Location[] = await response.json();

    return data.map((location) => ({
      value: `${location.id}`,
      label: location.name,
    }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
}
