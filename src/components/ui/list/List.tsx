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
}

export const List = ({
  header,
  items,
  giveaways,
  winners,
  children,
  onItemClick,
  addButton,
  className,
}: ListProps) => {
  if (!items?.length && !giveaways?.length && !children && !addButton)
    return null;

  return (
    <div className="flex flex-col w-full items-start">
      {header && (
        <p className="px-4 py-[5px] uppercase text-sm text-section-header-text tracking-footnote">
          {header}
        </p>
      )}

      <div
        className={`flex flex-col w-full rounded-[10px] overflow-hidden ${
          (items?.length || giveaways?.length) && !addButton ? "gap-3" : ""
        } ${className}`}
      >
        {!children && (items || giveaways) ? (
          <>
            {items?.map((item, index) => (
              <ListItem {...item} onClick={onItemClick} key={index} separator={
                !addButton ? index !== items.length - 1 : true
              } />
            ))}

            {giveaways?.map((giveaway, index) => (
              <GiveawayItem {...giveaway} onClick={onItemClick} key={index} />
            ))}

            {winners?.map((winner, index) => (
              <WinnerItem {...winner} onClick={onItemClick} key={index} />
            ))}

            {addButton && (
              <div className="py-2 px-4 max-h-[44px] items-center flex bg-section-bg w-full justify-between border-giveaway">
                {addButton}
              </div>
            )}
          </>
        ) : (
          <>{children}</>
        )}
      </div>
    </div>
  );
};
