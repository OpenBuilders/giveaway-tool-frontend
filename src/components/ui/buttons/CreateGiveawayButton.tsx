export const CreateGiveawayButton = ({
  disabled = false,
  onClick,
  children,
  className,
}: {
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={`w-full bg-button text-white font-medium py-[14px] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children || "Create Giveaway"}
    </button>
  );
};
