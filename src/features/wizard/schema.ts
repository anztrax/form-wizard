import { getValuesFromOptions } from "@/shared/components/select";
import { z } from "zod";
import { employmentTypeSelectOptions, roleSelectOptions } from "./resources";

const RoleEnum = z.enum(getValuesFromOptions(roleSelectOptions));
const EmploymentTypeEnum = z.enum(getValuesFromOptions(employmentTypeSelectOptions));

export const Step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email("Invalid email format"),
  department: z.string().min(1, "Department is required"),
  role: RoleEnum,
  employeeId: z.string().min(1, "Employee ID is missing"),
});

export const Step2Schema = z.object({
  photo: z.string().refine((val) => val.startsWith("data:image"), {
    message: "Photo is required",
  }),
  employmentType: EmploymentTypeEnum,
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
});

export const AdminSchema = Step1Schema.extend({
  roleType: z.literal("admin"),
}).merge(Step2Schema);

const OpsSchema = Step2Schema.extend({
  roleType: z.literal("ops"),
});

export const EmployeeFormSchema = z.discriminatedUnion("roleType", [
  AdminSchema,
  OpsSchema,
]);

export type EmployeeFormValues = z.infer<typeof EmployeeFormSchema>;
