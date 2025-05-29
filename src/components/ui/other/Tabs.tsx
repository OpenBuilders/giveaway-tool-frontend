import { useState } from "react";

export const Tabs = ({
  categories,
  activeIndex,
  setActiveIndex,
}: {
  categories: string[];
  activeIndex?: number;
  setActiveIndex?: (index: number) => void;
}) => {
  const [active, setActive] = useState(activeIndex || 0);

  const activeClass = "bg-segmented_control_active_bg border-[0.5px] border-quaternary-fill-bg rounded-[7px] shadow-tab";

  return (
    <div
      className={`bg-tertiary-fill-bg p-0.5 rounded-[9px] flex justify-between items-center`}
    >
      {categories.map((category, index) => (
        <span
          key={index}
          className={`h-7 w-full flex items-center justify-center gap-2 text-center py-[5px] px-3 cursor-pointer transition-colors duration-200 font-medium text-sm tracking-footnote ${
            (activeIndex !== undefined ? activeIndex : active) === index
              ? activeClass
              : ""
          }`}
          onClick={() => {
            setActive(index);
            if (setActiveIndex) setActiveIndex(index);
          }}
        >
          {category}
        </span>
      ))}
    </div>
  );
};
