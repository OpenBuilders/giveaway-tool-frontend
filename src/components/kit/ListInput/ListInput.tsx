import cn from "classnames";
import React, { ChangeEvent } from "react";

import styles from "./ListInput.module.scss";
import { useToast } from "../Toast";

export interface ListInputProps {
  textColor?: "primary" | "secondary" | "tertiary";
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  type?:
    | "text"
    | "number"
    | "password"
    | "email"
    | "tel"
    | "url"
    | "search"
    | "textarea";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: "on" | "off";
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  required?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  rows?: number;
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  after?: React.ReactNode;
}

export const ListInput: React.FC<ListInputProps> = ({
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  className,
  autoComplete = "off",
  maxLength,
  minLength,
  pattern,
  required = false,
  readOnly = false,
  name,
  id,
  textColor = "primary",
  inputMode,
  after,
  onBlur,
  rows,
}) => {
  const { showToast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      if (maxLength && e.target.value.length >= maxLength) {
        showToast({
          message: `Maximum ${maxLength} characters`,
          type: "error",
          time: 2000,
        });
      }
      const next = maxLength && e.target.value.length > maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
      onChange(next);
    }
  };

  return (
    <div className={styles.listInputContainer}>
      {type === "textarea" ? (
        <textarea
          className={cn(
            styles.listInput,
            textColor && styles[`listInput-${textColor}`],
            className,
          )}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
          readOnly={readOnly}
          name={name}
          id={id}
          inputMode={inputMode}
          rows={rows}
        />
      ) : (
        <input
          className={cn(
            styles.listInput,
            textColor && styles[`listInput-${textColor}`],
            className,
          )}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          required={required}
          readOnly={readOnly}
          name={name}
          id={id}
          inputMode={inputMode}
        />
      )}
      <div>{after}</div>
    </div>
  );
};
