import { ListInput, ListInputProps, Text } from "@/components/kit";
import React from "react";

interface LabeledInputProps extends ListInputProps {
  label: string;
  containerClassName?: string;
  additionalLabel?: string;
}

export const Input: React.FC<ListInputProps> = (props) => {
  return (
    <ListInput
      {...props}
      className={`!bg-section-bg !h-11 !rounded-[10px] !px-4 ${props.className}`}
    />
  );
};

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  additionalLabel,
  containerClassName = "",
  type = "text",
  ...rest
}) => {
  const { className, ...inputProps } = rest;

  return (
    <div
      className={`bg-section-bg relative flex h-11 items-center justify-between overflow-hidden rounded-[10px] px-4 ${containerClassName} `}
    >
      <span className="whitespace-nowrap">{label}</span>

      <div
        className={`flex flex-1 items-center justify-end overflow-hidden ${
          Number(value) <= 0 || !value ? "text-hint" : ""
        }`}
      >
        <input
          key={label}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          inputMode={rest.inputMode}
          autoCorrect="off"
          spellCheck="false"
          className={`placeholder:text-hint bg-transparent text-right focus:outline-none text-[17px] flex-1 min-w-0 ${className || ""}`}
          {...inputProps}
        />

        {additionalLabel && additionalLabel.length > 0 && (
          <div className="pl-2 flex-shrink-0 pointer-events-none">
            <Text type="text" color="hint" align="right" weight="normal">
              {additionalLabel}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
