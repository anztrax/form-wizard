export type DetailPayload = {
  photo: string;
  employmentType: string;
  location: string;
  locationName: string;
  notes?: string;
  employeeId?: string;
  email?: string;
};

export type DetailModel = DetailPayload & {
  id: string;
};
