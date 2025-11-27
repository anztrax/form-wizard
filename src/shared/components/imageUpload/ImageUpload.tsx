"use client";

import React, { useRef, useState } from "react";
import styles from "./imageUpload.module.css";
import classNames from "classnames";
import { Button } from "../button/Button";
import { formatBytesToMB } from "./utils";

export type ImageUploadProps = {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
  maxSizeInBytes?: number;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  previewClassName?: string;
  accept?: string;
  id?: string;
  hasError?: boolean;
  fullWidth?: boolean;
};

export type AcceptedImageTypes = {
  name: string,
  extensions: string[];
}[];

const acceptedImageTypes: AcceptedImageTypes = [
  {
    name: "JPEG",
    extensions: ['image/jpeg', 'image/jpg'],
  },
  {
    name: "PNG",
    extensions: ['image/png'],
  },
  {
    name: "GIF",
    extensions: ['image/gif'],
  },
  {
    name: "WEBP",
    extensions: ['image/webp'],
  }
];

const ACCEPTED_IMAGE_TYPES_EXTENSIONS = acceptedImageTypes.flatMap((item) => item.extensions);
const ACCEPTED_IMAGE_TYPES_NAME = acceptedImageTypes.map((item) => item.name).join(", ");

const DEFAULT_MAX_SIZE_IN_BYTES = 5 * 1024 * 1024;

export function ImageUpload(props: ImageUploadProps) {
  const {
    value,
    onChange,
    onError,
    maxSizeInBytes = DEFAULT_MAX_SIZE_IN_BYTES,
    helperText,
    disabled = false,
    className,
    previewClassName,
    accept = "image/*",
    id = "image-upload",
    hasError: externalHasError = false,
    fullWidth = false,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [internalError, setInternalError] = useState<string>("");

  React.useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      }
    } else if (typeof value === "string") {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES_EXTENSIONS.includes(file.type)) {
      return `Invalid file type. Please upload an image file (${ACCEPTED_IMAGE_TYPES_NAME}).`;
    }

    if (file.size > maxSizeInBytes) {
      const sizeMB = formatBytesToMB(maxSizeInBytes);
      return `File size exceeds ${sizeMB}MB. Please upload a smaller image.`;
    }

    return null;
  }

  const handleFileChange = (file: File | null) => {
    setInternalError("");

    if (!file) {
      onChange?.(null);
      return;
    }

    const error = validateFile(file);
    if (error) {
      setInternalError(error);
      onError?.(error);
      return;
    }

    onChange?.(file);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPreview(null);
    setInternalError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.(null);
  };

  const hasInternalError = Boolean(internalError);
  const hasError = hasInternalError || Boolean(externalHasError);

  const containerClasses = classNames(
    styles["upload"],
    {
      [styles["upload--disabled"]]: disabled,
      [styles["upload--error"]]: hasError,
      [styles["upload--full-width"]]: fullWidth,
    },
    className
  );

  const previewContainerClasses = classNames(
    styles["upload__preview"],
    previewClassName
  );

  return (
    <div className={containerClasses}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className={styles["upload__input"]}
        aria-label="Upload image"
        aria-invalid={hasError}
      />

      {preview ? (
        <div className={previewContainerClasses}>
          <img
            src={preview}
            alt="Preview"
            className={styles["upload__preview-image"]}
          />
          <div className={styles["upload__preview-overlay"]}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleClick}
              disabled={disabled}
              type="button"
            >
              Change Image
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              type="button"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={styles["upload__dropzone"]}
          onClick={handleClick}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <p className={styles["upload__text"]}>
            <span className={styles["upload__text-primary"]}>
              Click to upload
            </span>
          </p>
          <p className={styles["upload__text-secondary"]}>
            {ACCEPTED_IMAGE_TYPES_NAME} (max. {formatBytesToMB(maxSizeInBytes)}MB)
          </p>
        </div>
      )}

      {helperText && !hasError && (
        <p id={`${id}-helper`} className={styles["upload__helper"]}>
          {helperText}
        </p>
      )}

      {hasInternalError && (
        <p className={styles["upload__error"]} role="alert">
          ❌ {internalError}
        </p>
      )}
    </div>
  );
}
