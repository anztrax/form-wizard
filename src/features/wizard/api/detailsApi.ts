const API_BASE_URL_LOCATIONS = "http://localhost:4002";

export type DetailsPayload = {
  photo: string;
  employmentType: string;
  location: string;
  notes?: string;
};

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
