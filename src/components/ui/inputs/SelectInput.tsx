import { SelectIcon } from "@/assets/icons/SelectIcon";
import React from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  type?: "default" | "withIcon";
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  className = "",
  type = "default",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    const matched = options.find((opt) => String(opt.value) === raw);
    onChange(matched ? matched.value : raw);
    setIsOpen(false);
  };

  const selectedOption = options.find((o) => o.value === selectedValue);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`inline-flex flex-col items-end static ${className}`}>
      <div
        className="
          flex items-center justify-between relative overflow-hidden bg-section-bg rounded-[10px] px-4 w-full h-11
        "
      >
        <span>{label}</span>
        <div
          className={`relative inline-flex items-center gap-2 py-[5px] rounded-lg ${
            type === "default" ? "bg-tertiary-fill-bg" : ""
          } ${type !== "withIcon" && "px-3"}`}
        >
          <span className={`${isOpen || type === "withIcon" ? "text-accent-text" : ""} transition-all duration-100`}>
            {selectedOption?.label}
          </span>
          {type === "withIcon" && <SelectIcon />}

          <select
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={String(selectedValue)}
            onChange={handleChange}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
