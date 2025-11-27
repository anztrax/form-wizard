"use client";

import { Form } from "@/shared/components/form/Form";
import { FormProvider } from "react-hook-form";
import { useFormWizard } from "../hooks/useFormWizard";
import { Button } from "@/shared/components/button/Button";
import { Container } from "@/shared/components/container/Container";
import { Card } from "@/shared/components/card/Card";
import { ArrowLeft, ArrowRight, SendHorizontal, Trash2 } from "lucide-react";
import styles from "./FormWizardLayout.module.css";

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
    <Container className={styles["form-wizard-layout"]}>
      <Card className={styles["form-wizard-layout__card"]}>
        <FormProvider {...formWizard}>
          <Form
            layout={'vertical'}
            gap={'md'}
            onSubmit={formWizard.handleSubmit(onSubmitForm)}
            className={styles["form-wizard-layout__form"]}
          >
            <div className={styles["form-wizard-layout__content"]}>
              <h2 className={styles["form-wizard-layout__title"]}>{currentStep.label}</h2>
              {currentStep.render()}
            </div>
            <div className={styles["form-wizard-layout__button-container"]}>
              {formStepIndex > 0 && (
                <Button type="button" variant='outline' onClick={onPrevButtonClick}>
                  <ArrowLeft size={18} />
                  <span>Prev</span>
                </Button>
              )}

              {!isLastStepIndex && (
                <div className={styles["form-wizard-layout__button-group"]}>
                  <Button type="button" variant='outline' onClick={onNextButtonClick}>
                    <span>Next</span>
                    <ArrowRight size={18} />
                  </Button>
                </div>
              )}

              {isLastStepIndex && (
                <div className={styles["form-wizard-layout__button-group"]}>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onClearDraftAndReset}
                    disabled={isFormSubmitting}
                  >
                    <Trash2 size={18} />
                    <span>Reset</span>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isFormSubmitting}
                  >
                    <span>{isFormSubmitting ? "Submitting..." : "Submit"}</span>
                    {!isFormSubmitting && <SendHorizontal size={18} />}
                  </Button>
                </div>
              )}
            </div>
          </Form>
        </FormProvider>
      </Card>
    </Container>
  );
}
