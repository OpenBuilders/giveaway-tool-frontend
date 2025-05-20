import { CheckMark } from "@/assets/icons/CheckMarkIcon";
import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  selectedValue: string | number;
  onChange: (value: string) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div
      ref={ref}
      className={`inline-flex flex-col items-end static ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="
          flex items-center justify-between relative overflow-hidden bg-white rounded-[10px] px-4 w-full h-11
        "
      >
        <span>{label}</span>
        <div className="px-3 py-[5px] bg-tertiary-fill-bg rounded-lg">
          <span className={`${isOpen && "text-accent-text"} transition-all duration-100`}>
            {selectedOption?.label}
          </span>
        </div>
      </button>

      {isOpen && (
        <ul
          className="
            absolute w-full max-w-[250px] mt-[50px]
            max-h-60 overflow-auto z-10 dropdown-menu
          "
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="
                px-4 cursor-pointer h-11 
                flex justify-between items-center
              "
            >
              <span className="text-gray-800">{opt.label}</span>
              {opt.value === selectedValue && <CheckMark />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
