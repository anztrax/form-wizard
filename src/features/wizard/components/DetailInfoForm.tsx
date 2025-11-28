"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/common/components/form/Form";
import { Select } from "@/common/components/select";
import { Textarea } from "@/common/components/textarea/Textarea";
import { ImageUpload } from "@/common/components/imageUpload/ImageUpload";
import { employmentTypeSelectOptions } from "../resources";
import { Step2Schema } from "../schema";
import { useLocationsQuery } from "../../shared/hooks/useLocationsQuery";
import { useDebounce } from "@/common/hooks/useDebounce";
import { useToast } from "@/common/components/toast/useToast";
import z from "zod";
import { convertFiletoBase64 } from "@/common/utils/utils";

export default function DetailInfoForm() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<z.infer<typeof Step2Schema>>();

  const { showToast } = useToast();
  const [locationSearch, setLocationSearch] = useState("");
  const debouncedLocationSearch = useDebounce(locationSearch, 200);
  const {
    locations,
    isLoading: locationLoading,
    isError: isLocationsError,
    error: locationsError,
  } = useLocationsQuery(debouncedLocationSearch);

  useEffect(() => {
    if (isLocationsError && locationsError) {
      showToast({
        type: "error",
        message: `Failed to fetch locations: ${locationsError.message}`,
      });
    }
  }, [isLocationsError, locationsError]);

  const handlePhotoChange = async (file: File | null) => {
    if (file) {
      try {
        const base64 = await convertFiletoBase64(file);
        setValue("photo", base64, {
          shouldDirty: true,
          shouldValidate: true,
        });
      } catch (error) {
        console.error("Failed to convert image to base64:", error);
      }
    } else {
      setValue("photo", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <div>
      <FormField
        label="Photo"
        htmlFor="photo"
        required
        error={errors.photo?.message}
      >
        <Controller
          name="photo"
          control={control}
          render={({ field }) => (
            <ImageUpload
              id="photo"
              value={field.value}
              onChange={handlePhotoChange}
              maxSizeInBytes={(100 * 1024)}
              helperText="Upload your photo (JPEG, PNG, GIF, WEBP - max 0.10MB)"
              hasError={Boolean(errors.photo)}
              fullWidth
            />
          )}
        />
      </FormField>

      <FormField
        label="Employment Type"
        htmlFor="employmentType"
        required
        error={errors.employmentType?.message}
      >
        <Controller
          name="employmentType"
          control={control}
          render={({ field }) => (
            <Select
              options={employmentTypeSelectOptions}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              placeholder="Select employment type..."
              allowClear
              hasError={Boolean(errors.employmentType)}
              fullWidth
            />
          )}
        />
      </FormField>

      <FormField
        label="Office Location"
        htmlFor="location"
        required
        error={errors.location?.message}
      >
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Select
              options={locations}
              value={field.value}
              onChange={(value, option) => {
                field.onChange(value);
                setValue("locationName", option?.label ?? "", {
                  shouldDirty: true,
                });
              }}
              onInputChange={setLocationSearch}
              placeholder="Search and select location..."
              showSearch
              loading={locationLoading}
              allowClear
              hasError={Boolean(errors.location)}
              fullWidth
            />
          )}
        />
      </FormField>

      <FormField
        label="Notes"
        htmlFor="notes"
        error={errors.notes?.message}
      >
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              fullWidth
              rows={4}
              value={field.value || ""}
              onChange={field.onChange}
              hasError={Boolean(errors.notes)}
            />
          )}
        />
      </FormField>
    </div>
  );
}
