import { UsersIcon } from "@/assets/icons/UsersIcon";
import { useCallback, useEffect, useState } from "react";
import type { IListItem } from "@/interfaces";
import { WinnerCup } from "@/assets/icons/WinnerCup";
import { Block, Text } from "@/components/kit";

const AdminBadge = () => (
  <div className="bg-quaternary-fill-bg text-hint rounded-md px-1 py-0.5 text-xs font-medium uppercase">
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
      className={`bg-section-bg flex w-full items-start justify-between rounded-[14px] px-4 py-[11px] ${
        logo ? "after:left-[65px]" : "after:left-[16px]"
      } ${giveaway ? "min-h-[60px]" : ""} ${className}`}
      onClick={() => {
        if (onClick) onClick({ id, logo, title, description, giveaway });
      }}
    >
      {logo && (
        <div
          className={`mr-2.5 overflow-hidden ${
            typeof logo === "string"
              ? "aspect-square max-w-9 rounded-full bg-black"
              : ""
          }`}
        >
          {typeof logo === "string" ? (
            <img src={logo} alt="giveaway logo" />
          ) : (
            logo
          )}
        </div>
      )}
      <div className="flex w-full flex-col items-start">
        <div className={`flex flex-col ${giveaway ? "pb-2.5" : ""}`}>
          <div className="flex items-center gap-1.5">
            <span className="tracking-body font-medium">{title}</span>
            {giveaway?.isAdmin && <AdminBadge />}
          </div>

          {giveaway && (
            <>
              <div className="flex items-center gap-1">
                <UsersIcon />

                <span className="text-hint text-sm-max tracking-subheadline">
                  {giveaway.participants.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  · {endsIn}
                </span>
              </div>

              {/* <span className="text-hint text-sm-max tracking-subheadline">
                @{giveaway.telegramUsername}
              </span> */}
            </>
          )}
        </div>

        <Block row gap={8}>
          <div className="bg-tertiary-fill-bg flex items-center gap-1 rounded-[10px] px-1.5 py-1">
            <WinnerCup />

            <Text type="caption" weight="medium">
              {giveaway?.winners_count}
            </Text>
          </div>
        </Block>

        {description && (
          <Text type="caption" weight="medium">
            {description}
          </Text>
        )}
      </div>
    </div>
  );
};
