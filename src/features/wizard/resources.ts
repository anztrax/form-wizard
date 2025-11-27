import { SelectOption } from "@/shared/components/select";

export const roleSelectOptions: Array<SelectOption> = [
  { value: 'ops', label: "Ops" },
  { value: "admin", label: "Admin" },
  { value: "engineer", label: "Engineer" },
  { value: "hr", label: "HR" },
];

export const employmentTypeSelectOptions: Array<SelectOption> = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
];
