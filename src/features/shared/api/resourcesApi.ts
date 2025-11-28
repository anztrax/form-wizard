import { SelectOption } from "@/common/components/select";
import { API_URLS } from "./API_URLS";

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
    const url = new URL(`${API_URLS.DEPARTMENTS}`);

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
    const url = new URL(`${API_URLS.LOCATIONS}`);

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
