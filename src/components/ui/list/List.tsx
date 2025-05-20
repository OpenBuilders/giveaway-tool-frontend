import type { IListItem } from "@/interfaces";
import { ListItem } from "./ListItem";

export const List = ({
  groupName,
  items,
  onItemClick,
  children,
  addButton,
}: {
  groupName: string;
  items?: IListItem[];
  onItemClick?: (item: IListItem) => void;
  children?: React.ReactNode;
  addButton?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full items-start">
      <p className="px-4 py-[5px] uppercase text-sm text-section-header-text tracking-footnote">
        {groupName}
      </p>

      <div className="flex flex-col w-full rounded-[10px] overflow-hidden [&>div:last-child]:after:h-0">
        {!children && items ? (
          <>
            {items.map((item, index) => (
              <ListItem {...item} onClick={onItemClick} key={index} />
            ))}

            {addButton && (
              <div className="py-2 px-4 max-h-[44px] items-center flex bg-white w-full justify-between border-giveaway">
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
