"use client";

import { Form } from "@/shared/components/form/Form";
import { FormProvider } from "react-hook-form";
import { useFormWizard } from "../hooks/useFormWizard";
import { Button } from "@/shared/components/button/Button";

export function FormWizardLayout() {
  const {
    formWizard,
    currentStep,
    formStepIndex,
    isLastStepIndex,
    isFormSubmitting,

    onSubmitForm,
    onNextButtonClick,
    onPrevButtonClick,
    onClearDraftAndReset
  } = useFormWizard();

  return (
    <FormProvider {...formWizard}>
      <Form
        layout={'vertical'}
        gap={'md'}
        onSubmit={formWizard.handleSubmit(onSubmitForm)}
      >
        <h2>{currentStep.label}</h2>
        {currentStep.render()}
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          {formStepIndex > 0 && (
            <Button type="button" onClick={onPrevButtonClick}>
              Previous
            </Button>
          )}

          {!isLastStepIndex && (
            <Button type="button" onClick={onNextButtonClick}>
              Next
            </Button>
          )}

          {isLastStepIndex && (
            <div style={{
              display: "flex",
              gap: 8,
            }}>
              <Button
                type="button"
                variant="danger"
                onClick={onClearDraftAndReset}
                disabled={isFormSubmitting}
              >
                Clear Draft & Reset
              </Button>
              <Button
                type="submit"
                disabled={isFormSubmitting}
              >
                {isFormSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </FormProvider>
  );
}
