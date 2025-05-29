import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import type { IListItem } from "@/interfaces";

export const ListItem = ({
  id,
  logo,
  title,
  description,
  giveaway,
  onClick,
  className,
  isArrow = true,
}: IListItem & {
  onClick?: (item: IListItem) => void;
  className?: string;
  isArrow?: boolean;
}) => {
  return (
    <div
      className={`py-[11px] px-4 items-start flex bg-card-bg w-full justify-between border-giveaway ${
        logo ? "after:left-[65px]" : "after:left-[16px]"
      }${className}`}
      onClick={() => {
        if (onClick) onClick({ id, logo, title, description, giveaway });
      }}
    >
      {logo && (
        <div className="mr-2.5 rounded-full max-w-9 bg-black aspect-square overflow-hidden">
          <img src={logo} alt="giveaway logo" />
        </div>
      )}
      <div className="flex flex-col w-full items-start">
        <div className="flex flex-col">
          <div className="flex gap-1.5 items-center">
            <span className="font-medium tracking-body">{title}</span>
          </div>
        </div>

        {description && (
          <span className="text-subtitle text-sm-max tracking-subheadline">
            {description}
          </span>
        )}
      </div>
      {isArrow && (
        <div className="pl-4 flex items-center justify-center self-stretch">
          <ArrowIcon />
        </div>
      )}
    </div>
  );
};
