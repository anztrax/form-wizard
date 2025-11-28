import { EmployeeListContainer } from "@/features/employees/components/EmployeeListContainer";
import { Suspense } from "react";

export default function EmployeeListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeListContainer />
    </Suspense>
  );
}
