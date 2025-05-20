import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { UsersIcon } from "@/assets/icons/UsersIcon";
import { useEffect, useState } from "react";
import type { IListItem } from "@/interfaces";

const AdminBadge = () => (
  <div className="bg-quaternary-fill-bg text-subtitle font-medium text-xs px-1 py-0.5 rounded-md uppercase">
    admin
  </div>
);

export const ListItem = ({
  id,
  logo,
  title,
  description,
  giveaway,
  onClick,
}: IListItem & {
  onClick?: (item: IListItem) => void;
}) => {
  const [endsIn, setEndsIn] = useState("");

  const getEndsIn = () => {
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
  };

  useEffect(() => {
    getEndsIn();
    const interval = setInterval(() => {
      getEndsIn();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`py-2.5 px-4 min-h-[60px] items-center flex bg-white w-full justify-between border-giveaway ${
        logo ? "after:left-[65px]" : "after:left-[16px]"
      }`}
      onClick={() => {
        if (onClick) onClick({ id, logo, title, description, giveaway });
      }}
    >
      {logo && (
        <div className="mr-2.5 rounded-full max-w-10">
          <img src={logo} alt="giveaway logo" />
        </div>
      )}
      <div className="flex flex-col w-full items-start">
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

            <span className="text-subtitle text-sm-max tracking-subheadline">
              @{giveaway.telegramUsername}
            </span>
          </>
        )}

        {description && (
          <span className="text-subtitle text-sm-max tracking-subheadline">
            {description}
          </span>
        )}
      </div>
      <div className="pl-4 flex items-center justify-center">
        <ArrowIcon />
      </div>
    </div>
  );
};
