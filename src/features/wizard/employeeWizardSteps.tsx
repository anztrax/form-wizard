import type { FieldPath, FieldValues } from "react-hook-form";
import { EmployeeFormValues } from "./schema";
import BasicInfoForm from "./components/BasicInfoForm";
import DetailInfoForm from "./components/DetailInfoForm";

type WizardStep<T extends FieldValues> = {
  id: string;
  label: string;
  fields: FieldPath<T>[];
  render: () => React.ReactNode;
};

export const adminSteps: WizardStep<EmployeeFormValues>[] = [
  {
    id: "admin-step-1",
    label: "Basic info",
    fields: ["fullName", "email", "department", "employeeId", "role"],
    render: () => <BasicInfoForm />,
  },
  {
    id: "admin-step-2",
    label: "Employee details",
    fields: ["photo", "employmentType", "location", "notes"],
    render: () => <DetailInfoForm />,
  },
];

export const opsSteps: WizardStep<EmployeeFormValues>[] = [
  {
    id: "ops-step-1",
    label: "Employee details",
    fields: ["photo", "employmentType", "location", "notes", "role"],
    render: () => <DetailInfoForm />,
  },
];
