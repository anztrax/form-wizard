import { Suspense } from "react";
import { FormWizardLayout } from "@/features/wizard/components/FormWizardLayout";

export default function FormWizardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormWizardLayout />
    </Suspense>
  );
}
