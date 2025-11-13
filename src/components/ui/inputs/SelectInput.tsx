import { CheckMark } from "@/assets/icons/CheckMarkIcon";
import { SelectIcon } from "@/assets/icons/SelectIcon";
import React from "react";

interface Option {
  value: string | number;
  label: string;
  // Optional right-side icon displayed in the dropdown list
  rightIcon?: React.ReactNode;
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
  const selectedOption = options.find((o) => o.value === selectedValue);
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(() => {
    const idx = options.findIndex((o) => o.value === selectedValue);
    return idx === -1 ? 0 : idx;
  });

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const toggleOpen = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  const commitSelection = (index: number) => {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (
      !isOpen &&
      (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      commitSelection(highlightedIndex);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`static inline-flex flex-col items-end ${className}`}
      onKeyDown={onKeyDown}
    >
      <div className="bg-section-bg relative flex h-11 w-full items-center justify-between overflow-hidden rounded-[10px] px-4">
        <span>{label}</span>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={toggleOpen}
          className={`relative inline-flex items-center gap-2 rounded-lg py-[5px] outline-0 ${
            type === "default" ? "bg-tertiary-fill-bg" : ""
          } ${type !== "withIcon" && "px-3"} ${isOpen || type === "withIcon" ? "text-accent-text" : ""}`}
        >
          <span className="transition-all duration-100">
            {selectedOption?.label}
          </span>
          {type === "withIcon" && <SelectIcon isCustomColor />}
        </button>
      </div>

      {isOpen && (
        <div className="relative w-full">
          <div
            ref={menuRef}
            className="bg-quick-menu-background text-text drop-shadow-quick-menu absolute top-2 right-0 z-50 min-w-[250px] overflow-hidden rounded-2xl backdrop-blur-xl"
            role="listbox"
            tabIndex={-1}
          >
            {options.map((opt, index) => {
              const isHighlighted = index === highlightedIndex;
              const isSelected = opt.value === selectedValue;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`border-section-separator flex cursor-pointer items-center justify-between border-b-[0.5px] px-4 py-2 select-none last:border-b-0 ${
                    isHighlighted
                      ? "bg-quick-menu-background"
                      : "hover:bg-quick-menu-background/20"
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => commitSelection(index)}
                >
                  <div className="text-[15px] leading-none">{opt.label}</div>
                  <div className="text-accent-text h-[28px] w-[16px]">
                    {isSelected && <CheckMark />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
