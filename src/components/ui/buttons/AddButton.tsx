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
      className={`flex items-center gap-4 w-full ${className}`}
    >
      <CirclePlusIcon className="pl-1.5" />
      <span className="text-accent-text">{children}</span>
    </button>
  );
};
