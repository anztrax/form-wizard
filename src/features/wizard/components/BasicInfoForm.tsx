"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/shared/components/form/Form";
import { InputText } from "@/shared/components/inputText/InputText";
import { Select } from "@/shared/components/select";
import { roleSelectOptions } from "../resources";
import { Step1Schema } from "../schema";
import { useDepartments } from "../hooks/useDepartments";
import { useBasicInfo } from "../hooks/useBasicInfo";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { generateEmployeeId } from "../utils";
import z from "zod";

export default function BasicInfoForm() {
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue
  } = useFormContext<z.infer<typeof Step1Schema>>();

  const [departmentSearchText, setDepartmentSearchText] = useState("");
  const debouncedDepartementSearchText = useDebounce(departmentSearchText, 300);

  const {
    departments,
    isLoading: departmentLoading
  } = useDepartments(
    debouncedDepartementSearchText
  );
  const { count: existingCount } = useBasicInfo();

  const selectedDepartment = watch("department");
  const selectedRole = watch("role");
  const employeeIdValue = watch("employeeId");

  useEffect(() => {
    if (!selectedDepartment || !selectedRole || departments.length === 0) {
      return;
    }

    const employeeId = generateEmployeeId(
      selectedDepartment,
      selectedRole,
      existingCount,
      departments
    );

    if (employeeId) {
      setValue('employeeId', employeeId, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }, [
    selectedDepartment,
    selectedRole,
    existingCount,
    departments.length
  ]);

  return (
    <div>
      <FormField
        label="Full Name"
        htmlFor="fullName"
        required
        error={errors.fullName?.message}
      >
        <InputText
          id="fullName"
          placeholder="Enter your full name"
          fullWidth
          {...register("fullName")}
          hasError={Boolean(errors?.fullName)}
        />
      </FormField>

      <FormField
        label="Email"
        htmlFor="email"
        required
        error={errors.email?.message}
      >
        <InputText
          id="email"
          type="email"
          placeholder="Enter your email"
          fullWidth
          {...register("email")}
          hasError={Boolean(errors?.email)}
        />
      </FormField>

      <FormField
        label="Department"
        htmlFor="department"
        required
        error={errors.department?.message}
      >
        <Controller
          name={"department"}
          control={control}
          render={({ field }) => (
            <Select
              options={departments}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              onInputChange={setDepartmentSearchText}
              placeholder="Search and select department..."
              showSearch
              loading={departmentLoading}
              allowClear
              hasError={Boolean(errors?.department)}
              fullWidth
            />
          )}
        />
      </FormField>

      <FormField
        label="Role"
        htmlFor="role"
        required
        error={errors.role?.message}
      >
        <Controller
          name={"role"}
          control={control}
          render={({ field }) => (
            <Select
              options={roleSelectOptions}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              placeholder="Select a role..."
              allowClear
              hasError={Boolean(errors.role)}
              fullWidth
            />
          )}
        />
      </FormField>

      <FormField
        label="Employee ID"
        htmlFor="employeeId"
      >
        <InputText
          id="employeeId"
          placeholder="ENG-001"
          fullWidth
          disabled
          value={employeeIdValue || ""}
        />
      </FormField>
    </div>
  );
}
