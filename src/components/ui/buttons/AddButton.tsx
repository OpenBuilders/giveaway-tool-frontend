import { CirclePlusIcon } from "@/assets/icons/CirclePlustIcon";

export const AddButton = ({
  onClick,
  className,
  disabled,
  children,
}: {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-accent-text flex w-full items-center gap-4 ${className}`}
    >
      <CirclePlusIcon isCustomColor />
      <span>{children}</span>
    </button>
  );
};
