"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { EmployeeFormSchema, EmployeeFormValues } from "../schema";
import { adminSteps, opsSteps } from "../employeeWizardSteps";
import { useFormDraftPersistence } from "./useFormDraftPersistence";
import { useSubmitBasicInfo, useSubmitDetails } from "./useSubmitForm";
import { useToast } from "@/shared/components/toast/useToast";

const getFormRoleType = (role: string | null): 'admin' | 'ops' => {
  const lowercasedRole = (role ?? 'admin').toLowerCase();

  if (lowercasedRole === "ops") {
    return 'ops';
  }

  return 'admin';
}

export const useFormWizard = () => {
  const searchParams = useSearchParams();
  const remoteRoleType = getFormRoleType(searchParams.get("role"));

  const formWizard = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeFormSchema),
    mode: 'onChange',
    defaultValues: {
      roleType: remoteRoleType,
    },
    shouldUnregister: false,
  });
  const { watch, trigger } = formWizard;
  const roleType = watch("roleType");

  const steps = roleType === "admin" ? adminSteps : opsSteps;

  const [formStepIndex, setFormStepIndex] = useState(0);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const currentStep = steps[formStepIndex];
  const isLastStepIndex = formStepIndex === steps.length - 1;

  const submitBasicInfo = useSubmitBasicInfo();
  const submitDetails = useSubmitDetails();
  const { showToast } = useToast();

  const { clearDraftAndReset } = useFormDraftPersistence<EmployeeFormValues>({
    form: formWizard,
    roleType,
    storageKeyPrefix: "employee_form_draft",
    debounceMs: 2000,
    initialValues: {
      roleType,
    },
  });

  const onNextButtonClick = async () => {
    const valid = await trigger(currentStep.fields);

    if (!valid) {
      return;
    }

    if (!isLastStepIndex) {
      setFormStepIndex((oldIndex) => oldIndex + 1);
    }
  };

  const onPrevButtonClick = () => {
    if (formStepIndex > 0) {
      setFormStepIndex((oldIndex) => oldIndex - 1);
    }
  };

  const onSubmitForm = async (formValues: EmployeeFormValues) => {
    setIsFormSubmitting(true);

    try {
      if (formValues.roleType === "admin") {
        console.log("⏳ Submitting basicInfo…");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await submitBasicInfo.mutateAsync({
          fullName: formValues.fullName,
          email: formValues.email,
          department: formValues.department,
          role: formValues.role,
          employeeId: formValues.employeeId,
        });

        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log("⏳ Submitting details…");
        await submitDetails.mutateAsync({
          photo: formValues.photo,
          employmentType: formValues.employmentType,
          location: formValues.location,
          notes: formValues.notes,
        });

        console.log("🎉 All data processed successfully!");
      } else {
        console.log("⏳ Submitting details…");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await submitDetails.mutateAsync({
          photo: formValues.photo,
          employmentType: formValues.employmentType,
          location: formValues.location,
          notes: formValues.notes,
        });

        console.log("🎉 All data processed successfully!");
      }
      showToast({
        type: "success",
        message: "Form submitted successfully! All data has been processed.",
        durationInMs: 5000,
      });
      onClearDraftAndReset();
    } catch (error) {
      console.error("❌ Failed to submit form:", error);
      showToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to submit form. Please try again.",
        durationInMs: 5000,
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const onClearDraftAndReset = () => {
    clearDraftAndReset();
    setFormStepIndex(0);
  }

  return {
    formWizard,
    currentStep,
    formStepIndex,
    isLastStepIndex,
    isFormSubmitting,

    onSubmitForm,
    onNextButtonClick,
    onPrevButtonClick,
    onClearDraftAndReset,
  }
}

