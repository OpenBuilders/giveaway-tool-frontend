import { ListInput, ListInputProps, Text } from "@/components/kit";
import React, { useCallback, useState } from "react";

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
  const [additionalLabelNode, setAdditionalLabelNode] =
    useState<HTMLSpanElement | null>(null);
  const callbackAddLabelRef = useCallback((el: HTMLSpanElement | null) => {
    setAdditionalLabelNode(el);
  }, []);

  return (
    <div
      className={`bg-section-bg relative flex h-11 items-center justify-between overflow-hidden rounded-[10px] px-4 ${containerClassName} `}
    >
      <span className="w-full">{label}</span>

      <div
        className={`flex w-full justify-end ${
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
          style={{
            paddingRight: `${additionalLabelNode?.clientWidth}px`,
          }}
          className="placeholder:text-hint bg-transparent text-right focus:outline-none text-[17px]"
          {...rest}
        />

        {additionalLabel && additionalLabel.length > 0 && (
          <div
            ref={callbackAddLabelRef}
            className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 transform pl-2"
          >
            <Text type="text" color="hint" align="right" weight="normal">
              {additionalLabel}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
