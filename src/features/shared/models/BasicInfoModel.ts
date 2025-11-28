export type BasicInfoPayload = {
  fullName: string;
  email: string;
  department: string;
  departmentName: string;
  role: string;
  employeeId: string;
};


export type BasicInfoModel = BasicInfoPayload & {
  id: string;
};
