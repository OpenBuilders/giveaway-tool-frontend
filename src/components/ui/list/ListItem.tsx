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
  rightIcon?:
    | "arrow"
    | "done"
    | "remove"
    | "selected"
    | "unselected"
    | string
    | React.ReactNode;
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
      <div className="flex w-full items-center gap-2.5 max-w-full min-w-0">
        {logo && (
          <div
            className={`aspect-square min-h-10 min-w-10 overflow-hidden rounded-full ${
              typeof logo === "string" ? "h-10 w-10" : ""
            }`}
          >
            {typeof logo === "string" ? (
              <img src={logo} alt="giveaway logo" className="object-cover" />
            ) : (
              logo
            )}
          </div>
        )}
        <div className="flex flex-col items-start w-full min-w-0">
          <span className="font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </span>

          {description && (
            <span className="description text-hint text-sm-max tracking-subheadline">
              {description}
            </span>
          )}
        </div>
      </div>

      {rightIcon && (
        <div
          className="text-subtitle flex items-center justify-center self-stretch pl-4"
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
          {rightIcon === "selected" && (
            <div className="bg-button text-text-overlay flex h-6 w-6 cursor-pointer items-center justify-center rounded-full p-1.5">
              <CheckMark />
            </div>
          )}
          {rightIcon === "unselected" && (
            <div className="border-border-separator relative h-6 w-6 cursor-pointer rounded-full border-[1.5px]" />
          )}
          {!["arrow", "done", "remove", "selected", "unselected"].includes(
            rightIcon as string,
          ) && <div className="rightSide">{rightIcon}</div>}
        </div>
      )}
    </div>
  );
};
