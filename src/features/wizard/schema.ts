import { getValuesFromOptions } from "@/common/components/select";
import { z } from "zod";
import { employmentTypeSelectOptions, roleSelectOptions } from "./resources";

const RoleEnum = z.enum(getValuesFromOptions(roleSelectOptions), {
  error: 'Invalid selection. Please choose valid role',
});
const EmploymentTypeEnum = z.enum(getValuesFromOptions(employmentTypeSelectOptions), {
  error: 'Invalid selection. Please choose valid employment type',
});

export const Step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email("Invalid email format"),
  department: z.string({
    error: "Department is required"
  }).min(1, "Department is required"),
  departmentName: z.string({
    error: "Department name is required"
  }).min(1, "Department nameis required"),
  role: RoleEnum,
  employeeId: z.string().min(1, "Employee ID is missing"),
});

export const Step2Schema = z.object({
  photo: z.string({
    message: "Photo is required",
  }).refine((val) => val.startsWith("data:image"), {
    message: "Photo is required",
  }),
  employmentType: EmploymentTypeEnum,
  location: z.string({
    error: "Location is required"
  }).min(1, "Location is required"),
  locationName: z.string({
    error: "Location name is required"
  }).min(1, "Location name is required"),
  notes: z.string().optional(),
});

export const AdminSchema = Step1Schema.extend({
  roleType: z.literal("admin"),
}).extend(Step2Schema.shape);

const OpsSchema = Step2Schema.extend({
  roleType: z.literal("ops"),
});

export const EmployeeFormSchema = z.discriminatedUnion("roleType", [
  AdminSchema,
  OpsSchema,
]);

export type EmployeeFormValues = z.infer<typeof EmployeeFormSchema>;
