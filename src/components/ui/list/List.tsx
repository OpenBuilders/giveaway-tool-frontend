import type { IListItem } from "@/interfaces";
import { ListItem } from "./ListItem";
import { GiveawayItem } from "./GiveawayItem";

export const List = ({
  groupName,
  items,
  giveaways,
  onItemClick,
  children,
  addButton,
  className,
}: {
  groupName?: string;
  items?: IListItem[];
  giveaways?: IListItem[];
  onItemClick?: (item: IListItem) => void;
  children?: React.ReactNode;
  addButton?: React.ReactNode;
  className?: string;
}) => {
  if (!items?.length && !giveaways?.length && !children && !addButton) return null;

  return (
    <div className="flex flex-col w-full items-start">
      {groupName && (
        <p className="px-4 py-[5px] uppercase text-sm text-section-header-text tracking-footnote">
          {groupName}
        </p>
      )}

      <div className={`flex flex-col w-full rounded-[10px] overflow-hidden gap-3 ${className}`}>
        {!children && (items || giveaways) ? (
          <>
            {items?.map((item, index) => (
              <ListItem {...item} onClick={onItemClick} key={index} />
            ))}

            {giveaways?.map((giveaway, index) => (
              <GiveawayItem {...giveaway} onClick={onItemClick} key={index} />
            ))}

            {addButton && (
              <div className="py-2 px-4 max-h-[44px] items-center flex bg-card-bg w-full justify-between border-giveaway">
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
