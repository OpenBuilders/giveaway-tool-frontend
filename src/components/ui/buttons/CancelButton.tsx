import { CirclePlusIcon } from "@/assets/icons/CirclePlustIcon";

export const CancelButton = ({
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
      className={`flex items-center gap-4 w-full text-destructive disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      <CirclePlusIcon isCustomColor />
      <span>{children}</span>
    </button>
  );
};
