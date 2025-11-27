import { SelectOption } from "@/shared/components/select";

export function generateEmployeeId(
  selectedDepartment: string | undefined,
  selectedRole: string | undefined,
  existingCount: number,
  departments: SelectOption[]
): string | null {
  if (!selectedDepartment || !selectedRole) {
    return null;
  }

  const selectedDept = departments.find(dept => dept.value === selectedDepartment);
  const deptLabel = selectedDept?.label || selectedDepartment;
  const deptAbbr = deptLabel.substring(0, 3).toUpperCase();
  const nextNumber = (existingCount + 1).toString().padStart(3, "0");
  const employeeId = `${deptAbbr}-${nextNumber}`;

  return employeeId;
}
