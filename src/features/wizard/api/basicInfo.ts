const API_BASE_URL = "http://localhost:4001";

export type BasicInfo = {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
};

export async function fetchBasicInfo(): Promise<BasicInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/basicInfo`);

    if (!response.ok) {
      throw new Error(`Failed to fetch basic info: ${response.statusText}`);
    }

    const data: BasicInfo[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching basic info:", error);
    throw error;
  }
}
