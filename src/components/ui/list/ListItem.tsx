import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { CheckMark } from "@/assets/icons/CheckMarkIcon";
import type { IListItem } from "@/interfaces";

type RightIconType =
  | "arrow"
  | "done"
  | "remove"
  | "selected"
  | "unselected"
  | string
  | React.ReactNode;

type ExtendedListItemProps = IListItem & {
  onClick?: (item: IListItem) => void;
  onActionClick?: (item: IListItem) => void;
  className?: string;
  separator?: boolean;
  rightIcon?: RightIconType;
  // Merged API additions
  text?: React.ReactNode;
  children?: React.ReactNode;
  before?: React.ReactNode;
  after?: React.ReactNode;
  chevron?: boolean;
  disabled?: boolean;
  padding?: string;
  height?: string;
  isCompleted?: boolean;
  canDrag?: boolean;
};

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
  // merged props
  text,
  children,
  before,
  after,
  chevron,
  disabled,
  padding,
  height,
  isCompleted,
  canDrag,
}: ExtendedListItemProps) => {
  const handleRootClick = () => {
    if (disabled) return;
    if (onClick) onClick({ id, logo, title, description, giveaway });
  };

  const showChevron = chevron && !isCompleted && !rightIcon && !after;
  const isArrowIcon =
    rightIcon === "arrow" || (rightIcon === undefined && showChevron);

  return (
    <div
      className={`bg-section-bg border-giveaway flex w-full justify-between px-4 ${
        (logo || before) ? "py-[5px] after:left-[65px]" : "py-[11px] after:left-[16px]"
      } ${!separator ? "after:hidden" : ""} ${
        (description || text) ? "items-start" : "items-center"
      } ${disabled ? "opacity-50 cursor-default" : onClick ? "cursor-pointer" : ""} ${className || ""}`}
      style={{
        padding,
        minHeight: height,
        pointerEvents: disabled ? "none" : undefined,
      }}
      onClick={handleRootClick}
    >
      <div className="flex w-full items-center gap-2.5 max-w-full min-w-0">
        {before ? (
          <div className="min-h-10 min-w-10 flex items-center justify-center">{before}</div>
        ) : (
          logo && (
            <div
              className={`aspect-square min-h-10 min-w-10 overflow-hidden rounded-full ${
                typeof logo === "string" ? "h-10 w-10" : ""
              }`}
            >
              {typeof logo === "string" ? (
                <img src={logo} alt="list item logo" className="object-cover" />
              ) : (
                logo
              )}
            </div>
          )
        )}
        <div className="flex flex-col items-start w-full min-w-0">
          {(text || title) && (
            <span className="font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {text ?? title}
            </span>
          )}

          {(description || children) && (
            <span className="description text-hint text-sm-max tracking-subheadline w-full">
              {description}
              {children}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center self-stretch pl-4">
        {after ? (
          <div className="flex items-center">{after}</div>
        ) : (
          <div
            className="text-subtitle flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (onActionClick) {
                onActionClick({ id, logo, title, description, giveaway });
              } else if (onClick && !disabled) {
                onClick({ id, logo, title, description, giveaway });
              }
            }}
          >
            {isArrowIcon && <ArrowIcon isCustomColor={true} />}
            {rightIcon === "done" && (
              <div className="bg-button-confirm-color text-text-overlay flex h-6 w-6 items-center justify-center rounded-full p-1.5">
                <CheckMark />
              </div>
            )}
            {rightIcon === "remove" && (
              <div className="bg-destructive after:bg-section-bg relative h-6 w-6 rounded-full after:absolute after:top-1/2 after:left-1/2 after:h-0.5 after:w-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:content-['']" />
            )}
            {rightIcon === "selected" && (
              <div className="bg-button text-text-overlay flex h-6 w-6 items-center justify-center rounded-full p-1.5">
                <CheckMark />
              </div>
            )}
            {rightIcon === "unselected" && (
              <div className="border-border-separator relative h-6 w-6 rounded-full border-[1.5px]" />
            )}
            {![
              "arrow",
              "done",
              "remove",
              "selected",
              "unselected",
              undefined,
            ].includes(rightIcon as string) && (
              <div className="rightSide">{rightIcon as React.ReactNode}</div>
            )}
            {isCompleted && rightIcon === undefined && (
              <div className="flex h-6 w-6 items-center justify-center">
                <CheckMark />
              </div>
            )}
          </div>
        )}
        {canDrag && (
          <div className="ml-2 flex items-center" style={{ touchAction: "none" }}>
            <span className="block h-4 w-1.5 rounded-sm bg-[linear-gradient(#C0C4CC_20%,transparent_20%,transparent_40%,#C0C4CC_40%,#C0C4CC_60%,transparent_60%,transparent_80%,#C0C4CC_80%)]" />
          </div>
        )}
      </div>
    </div>
  );
};
