import { UsersIcon } from "@/assets/icons/UsersIcon";
import { useCallback, useEffect, useState } from "react";
import type { IListItem } from "@/interfaces";

const AdminBadge = () => (
  <div className="bg-quaternary-fill-bg text-subtitle font-medium text-xs px-1 py-0.5 rounded-md uppercase">
    admin
  </div>
);

export const GiveawayItem = ({
  id,
  logo,
  title,
  description,
  giveaway,
  onClick,
  className,
}: IListItem & {
  onClick?: (item: IListItem) => void;
  className?: string;
}) => {
  const [endsIn, setEndsIn] = useState("");

  const getEndsIn = useCallback(() => {
    if (!giveaway) {
      setEndsIn("");
      return;
    }

    const endDate = new Date(giveaway.endsAt);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) {
      setEndsIn("Ended");
      return;
    }

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      setEndsIn(`${days}d ${hours}h`);
    } else if (hours > 0) {
      setEndsIn(`${hours}h ${minutes}m`);
    } else {
      setEndsIn(`${minutes}m`);
    }
  }, [giveaway]);

  useEffect(() => {
    getEndsIn();
    const interval = setInterval(() => {
      getEndsIn();
    }, 60000);

    return () => clearInterval(interval);
  }, [getEndsIn]);

  return (
    <div
      className={`py-[11px] px-4 items-start flex bg-card-bg w-full justify-between rounded-[14px] ${
        logo ? "after:left-[65px]" : "after:left-[16px]"
      } ${giveaway ? "min-h-[60px]" : ""} ${className}`}
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
        <div className={`flex flex-col ${giveaway ? "pb-2.5" : ""}`}>
          <div className="flex gap-1.5 items-center">
            <span className="font-medium tracking-body">{title}</span>
            {giveaway?.isAdmin && <AdminBadge />}
          </div>
  
          {giveaway && (
            <>
              <div className="flex gap-1 items-center">
                <UsersIcon />
  
                <span className="text-subtitle text-sm-max tracking-subheadline">
                  {giveaway.participants.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  · {endsIn}
                </span>
              </div>
  
              {/* <span className="text-subtitle text-sm-max tracking-subheadline">
                @{giveaway.telegramUsername}
              </span> */}
            </>
          )}
        </div>

        {giveaway && giveaway.requirements && giveaway.requirements.length > 0 && (
          <div className="overflow-x-scroll flex gap-2">
            {giveaway.requirements.map((requirement, index) => (
              <div
                key={index}
                className="px-1.5 py-1 rounded-[10px] bg-white flex gap-1 items-center"
              >
                <img
                  src={
                    requirement.type === "subscription"
                      ? "/gift.svg"
                      : "/gift.svg"
                  }
                  alt=""
                  width={20}
                  className="rounded-full bg-black"
                />
                <span className="text-sm-max tracking-subheadline">
                  {String(requirement.value).replace("@", "")}
                </span>
              </div>
            ))}
          </div>
        )}

        {description && (
          <span className="text-subtitle text-sm-max tracking-subheadline">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
