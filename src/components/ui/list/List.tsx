import type { IListItem } from "@/interfaces";
import { ListItem } from "./ListItem";
import { GiveawayItem } from "./GiveawayItem";
import { WinnerItem } from "./WinnerItem";

interface ListProps {
  header?: string;
  items?: IListItem[];
  giveaways?: IListItem[];
  winners?: IListItem[];
  children?: React.ReactNode;
  onItemClick?: (item: IListItem) => void;
  addButton?: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  beforeList?: React.ReactNode;
}

export const List = ({
  header,
  footer,
  beforeList,
  items,
  giveaways,
  winners,
  children,
  onItemClick,
  addButton,
  className,
}: ListProps) => {
  const addButtonClass =
    "bg-section-bg border-giveaway flex max-h-[44px] w-full items-center justify-between px-4 py-2";

  if (!items?.length && !giveaways?.length && !children && !addButton)
    return null;

  return (
    <div className="flex w-full flex-col items-start">
      {header && (
        <p className="text-section-header-text tracking-footnote px-4 py-[5px] text-sm uppercase">
          {header}
        </p>
      )}

      {beforeList && <div className="mb-2.5 w-full">{beforeList}</div>}

      <div
        className={`flex w-full flex-col overflow-hidden rounded-[10px] ${
          giveaways && !addButton ? "gap-3" : ""
        } ${className}`}
      >
        {!children && (items || giveaways) ? (
          <>
            {items?.map((item, index) => (
              <ListItem
                {...item}
                {...(onItemClick && {
                  onItemClick,
                })}
                key={index}
                separator={!addButton ? index !== items.length - 1 : true}
              />
            ))}

            {giveaways?.map((giveaway, index) => (
              <GiveawayItem {...giveaway} onClick={onItemClick} key={index} />
            ))}

            {winners?.map((winner, index) => (
              <WinnerItem {...winner} onClick={onItemClick} key={index} />
            ))}

            {addButton && !children && (items || giveaways) && (
              <div className={addButtonClass}>{addButton}</div>
            )}
          </>
        ) : (
          children
        )}
      </div>

      {addButton && children && String(children).length >= 0 && (
        <div
          className={`${addButtonClass} rounded-[10px] ${
            (items?.length === 0 && giveaways?.length === 0) ||
            (children && String(children).length === 0)
              ? ""
              : "mt-2.5"
          }`}
        >
          {addButton}
        </div>
      )}

      {footer && (
        <p className="text-section-header-text tracking-footnote px-4 py-[5px] text-sm">
          {footer}
        </p>
      )}
    </div>
  );
};
