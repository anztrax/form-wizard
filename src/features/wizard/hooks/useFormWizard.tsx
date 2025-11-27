"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { EmployeeFormSchema, EmployeeFormValues } from "../schema";
import { adminSteps, opsSteps } from "../employeeWizardSteps";
import { useFormDraftPersistence } from "./useFormDraftPersistence";

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
  const currentStep = steps[formStepIndex];
  const isLastStepIndex = formStepIndex === steps.length - 1;

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

  const onSubmitForm = async (formvalues: EmployeeFormValues) => {
    console.log("Form Values:", formvalues);
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

    onSubmitForm,
    onNextButtonClick,
    onPrevButtonClick,
    onClearDraftAndReset,
  }
}

