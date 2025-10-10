import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { CheckMark } from "@/assets/icons/CheckMarkIcon";
import type { IListItem } from "@/interfaces";

export const ListItem = ({
  id,
  logo,
  title,
  description,
  giveaway,
  onClick,
  onActionClick,
  className,
  separator = true,
  rightIcon,
}: IListItem & {
  onClick?: (item: IListItem) => void;
  onActionClick?: (item: IListItem) => void;
  className?: string;
  separator?: boolean;
  rightIcon?: "arrow" | "done" | "remove" | React.ReactNode;
}) => {
  return (
    <div
      className={`bg-section-bg border-giveaway flex w-full justify-between px-4 ${
        logo ? "py-[5px] after:left-[65px]" : "py-[11px] after:left-[16px]"
      } ${!separator ? "after:hidden" : ""} ${
        description ? "items-start" : "items-center"
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={() => {
        if (onClick) onClick({ id, logo, title, description, giveaway });
      }}
    >
      <div className="flex items-center gap-2.5">
        {logo && (
          <div
            className={`overflow-hidden rounded-full ${
              typeof logo === "string" ? "w-10 h-10" : ""
            }`}
          >
            {typeof logo === "string" ? (
              <img
                src={logo}
                alt="giveaway logo"
                className="object-cover"
              />
            ) : (
              logo
            )}
          </div>
        )}
        <div className="flex w-fit flex-col items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="tracking-body font-medium">{title}</span>
            </div>
          </div>
  
          {description && (
            <span className="description text-hint text-sm-max tracking-subheadline">
              {description}
            </span>
          )}
        </div>
      </div>

      {rightIcon && (
        <div
          className="flex items-center justify-center self-stretch pl-4 text-subtitle"
          onClick={() => {
            if (onActionClick)
              onActionClick({ id, logo, title, description, giveaway });
          }}
        >
          {rightIcon === "arrow" && <ArrowIcon isCustomColor={true} />}
          {rightIcon === "done" && (
            <div className="bg-button-confirm-color text-text-overlay flex h-6 w-6 cursor-pointer items-center justify-center rounded-full p-1.5">
              <CheckMark />
            </div>
          )}
          {rightIcon === "remove" && (
            <div className="bg-destructive after:bg-section-bg relative h-6 w-6 cursor-pointer rounded-full after:absolute after:top-1/2 after:left-1/2 after:h-0.5 after:w-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:content-['']" />
          )}
          {typeof rightIcon !== "string" && <div className="rightSide">{rightIcon}</div>}
        </div>
      )}
    </div>
  );
};
