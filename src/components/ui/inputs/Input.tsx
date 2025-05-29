import React, { useCallback, useState } from "react";
import type { InputHTMLAttributes } from "react";

interface LabeledInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: string;
  additionalLabel?: string;
}

export const Input: React.FC<LabeledInputProps> = ({
  value,
  onChange,
  containerClassName = "",
  ...rest
}) => {
  return (
    <div
      className={`
        flex items-center justify-between relative overflow-hidden bg-card-bg rounded-[10px] px-4 h-11
        ${containerClassName}
      `}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="
          bg-transparent 
          focus:outline-none 
          placeholder:text-subtitle
        "
        {...rest}
      />
    </div>
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
  const [additionalLabelNode, setAdditionalLabelNode] =
    useState<HTMLSpanElement | null>(null);
  const callbackAddLabelRef = useCallback((el: HTMLSpanElement | null) => {
    setAdditionalLabelNode(el);
  }, []);

  return (
    <div
      className={`
        flex items-center justify-between relative overflow-hidden bg-card-bg rounded-[10px] px-4 h-11
        ${containerClassName}
      `}
    >
      <span className="font-medium w-full">{label}</span>

      <div
        className={`w-full flex justify-end ${
          Number(value) <= 0 || !value ? "text-subtitle" : ""
        }`}
      >
        <input
          key={label}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputMode="numeric"
          autoCorrect="off"
          spellCheck="false"
          style={{
            paddingRight: `${additionalLabelNode?.clientWidth}px`,
          }}
          className="
            text-right 
            bg-transparent 
            focus:outline-none 
            placeholder:text-subtitle
          "
          {...rest}
        />

        {additionalLabel && additionalLabel.length > 0 && (
          <span
            ref={callbackAddLabelRef}
            className="text-hint text-[15px] leading-5 right-5 pl-2 absolute top-1/2 transform -translate-y-1/2 pointer-events-none"
          >
            {additionalLabel}
          </span>
        )}
      </div>
    </div>
  );
};
