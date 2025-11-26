import React, { createContext, useContext } from "react";
import classNames from "classnames";
import styles from "./form.module.css";

export type FormLayout = "vertical";
export type FormGap = "sm" | "md" | "lg";

type FormContextValue = {
  layout: FormLayout;
  gap: FormGap;
};

const FormContext = createContext<FormContextValue>({
  layout: "vertical",
  gap: "md",
});

export type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  layout?: FormLayout;
  gap?: FormGap;
  className?: string;
}

export function Form(props: FormProps) {
  const {
    layout = "vertical",
    gap = "md",
    className = "",
    children,
    ...rest
  } = props;

  const baseClass = "form";
  const formClassName = classNames(
    styles[baseClass],
    styles[`${baseClass}--layout-${layout}`],
    styles[`${baseClass}--gap-${gap}`],
    className
  );

  return (
    <FormContext.Provider value={{ layout, gap }}>
      <form className={formClassName} {...rest}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  layout?: FormLayout;
  gap?: FormGap;
  className?: string;
  children: React.ReactNode;
}

export function FormField(props: FormFieldProps) {
  const {
    label,
    htmlFor,
    required,
    error,
    helpText,
    layout,
    gap,
    className = "",
    children,
  } = props;

  const ctx = useContext(FormContext);
  const finalLayout = layout ?? ctx.layout;
  const finalGap = gap ?? ctx.gap;
  const hasError = Boolean(error);

  const baseClass = "form-field";
  const fieldClassName = classNames(
    styles[baseClass],
    styles[`${baseClass}--layout-${finalLayout}`],
    styles[`${baseClass}--gap-${finalGap}`],
    { [styles[`${baseClass}--error`]]: hasError },
    className
  );

  return (
    <div className={fieldClassName}>
      {label && (
        <label className={styles[`${baseClass}__label`]} htmlFor={htmlFor}>
          <span className={styles[`${baseClass}__label-text`]}>{label}</span>
          {required && (
            <span className={styles[`${baseClass}__required`]} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className={styles[`${baseClass}__control`]}>
        {children}
        {error && (
          <div className={styles[`${baseClass}__error`]} role="alert">
            {error}
          </div>
        )}
        {helpText && !error && (
          <div className={styles[`${baseClass}__help`]}>{helpText}</div>
        )}
      </div>
    </div>
  );
};
