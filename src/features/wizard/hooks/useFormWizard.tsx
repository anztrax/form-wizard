"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { EmployeeFormSchema, EmployeeFormValues } from "../schema";
import { adminSteps, opsSteps } from "../employeeWizardSteps";
import { useFormDraftPersistence } from "./useFormDraftPersistence";
import {
  useSubmitBasicInfoMutation,
  useSubmitDetailMutation
} from "../../shared/hooks/useSubmitFormMutations";
import { useToast } from "@/common/components/toast/useToast";
import { useLoadingModal } from "@/common/components/modal";

const getFormRoleType = (role: string | null): 'admin' | 'ops' => {
  const lowercasedRole = (role ?? 'admin').toLowerCase();

  if (lowercasedRole === "ops") {
    return 'ops';
  }

  return 'admin';
}

const FORM_MESSAGES = {
  SUBMITTING_FORM: "⏳ Submitting form...",
  SUBMITTING_BASIC_INFO: "⏳ Submitting basicInfo...",
  SUBMITTING_DETAILS: "⏳ Submitting details...",
  SUCCESS: "🎉 All data processed successfully!",
  ERROR: "❌ Failed to submit form:",
  TOAST_SUCCESS: "Form submitted successfully! All data has been processed.",
  TOAST_ERROR: "Failed to submit form. Please try again.",
} as const;

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
  const { showLoading, hideLoading, isLoading } = useLoadingModal();
  const { showToast } = useToast();
  const { watch, trigger } = formWizard;
  const roleType = watch("roleType");

  const steps = roleType === "admin" ? adminSteps : opsSteps;

  const [formStepIndex, setFormStepIndex] = useState(0);
  const currentStep = steps[formStepIndex];
  const isLastStepIndex = formStepIndex === steps.length - 1;

  const submitBasicInfoMutation = useSubmitBasicInfoMutation();
  const submitDetailMutation = useSubmitDetailMutation();

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
    showLoading(FORM_MESSAGES.SUBMITTING_FORM);
    try {
      if (formValues.roleType === "admin") {
        console.log(FORM_MESSAGES.SUBMITTING_BASIC_INFO);
        showLoading(FORM_MESSAGES.SUBMITTING_BASIC_INFO);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await submitBasicInfoMutation.mutateAsync({
          fullName: formValues.fullName,
          email: formValues.email,
          department: formValues.department,
          departmentName: formValues?.departmentName,
          role: formValues.role,
          employeeId: formValues.employeeId,
        });

        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log(FORM_MESSAGES.SUBMITTING_DETAILS);
        showLoading(FORM_MESSAGES.SUBMITTING_DETAILS);
        await submitDetailMutation.mutateAsync({
          photo: formValues.photo,
          employmentType: formValues.employmentType,
          location: formValues.location,
          locationName: formValues.locationName,
          notes: formValues.notes,
          employeeId: formValues?.employeeId,
          email: formValues?.email,
        });
      } else {
        console.log(FORM_MESSAGES.SUBMITTING_DETAILS);
        showLoading(FORM_MESSAGES.SUBMITTING_DETAILS);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await submitDetailMutation.mutateAsync({
          photo: formValues.photo,
          employmentType: formValues.employmentType,
          location: formValues.location,
          locationName: formValues.locationName,
          notes: formValues.notes,
        });
      }
      console.log(FORM_MESSAGES.SUCCESS);
      showLoading(FORM_MESSAGES.SUCCESS);
      hideLoading();
      showToast({
        type: "success",
        message: FORM_MESSAGES.TOAST_SUCCESS,
        durationInMs: 5000,
      });
      onClearDraftAndReset();
    } catch (error) {
      hideLoading();
      console.error(FORM_MESSAGES.ERROR, error);
      showToast({
        type: "error",
        message: error instanceof Error ? error.message : FORM_MESSAGES.TOAST_ERROR,
        durationInMs: 5000,
      });
    } finally {
      hideLoading();
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
    isFormSubmitting: isLoading,

    onSubmitForm,
    onNextButtonClick,
    onPrevButtonClick,
    onClearDraftAndReset,
  }
}

