import type { IListItem } from "@/interfaces";

export const WinnerItem = ({
  id,
  logo,
  title,
  winner,
  onClick,
  className,
  separator = true,
}: IListItem & {
  onClick?: (item: IListItem) => void;
  className?: string;
  separator?: boolean;
}) => {
  return (
    <div
      className={`py-[11px] px-4 items-start flex bg-section-bg w-full justify-between border-giveaway ${
        logo ? "after:left-[65px]" : "after:left-[16px]"
      } ${!separator ? "after:hidden" : ""} ${className}`}
      onClick={() => {
        if (onClick) onClick({ id, logo, title, winner });
      }}
    >
      {logo && (
        <div className={`mr-2.5 overflow-hidden ${
          typeof logo === "string" ? "bg-black rounded-full aspect-square max-w-9" : ""
        }`}>
          {typeof logo === "string" ? (
            <img src={logo} alt="giveaway logo" />
          ) : (
            logo
          )}
        </div>
      )}
      <div className="flex w-full justify-between items-center">
        <span className="font-medium tracking-body">{title}</span>

        <span className="text-hint tracking-body">{winner?.place}</span>
      </div>
    </div>
  );
};
