import { useCallback, useEffect, useState } from "react";
// import { WinnerCup } from "@/assets/icons/WinnerCup";
import { Block, Text } from "@/components/kit";
import { GiveawayAvatar } from "../GiveawayAvatar";
import type { IListItem } from "@/interfaces";

// const AdminBadge = () => (
//   <div className="bg-quaternary-fill-bg text-hint rounded-md px-1 py-0.5 text-xs font-medium uppercase">
//     admin
//   </div>
// );

export const GiveawayItem = ({
  id,
  logo,
  title,
  description,
  giveaway,
  onClick,
  className,
  number,
}: IListItem & {
  onClick?: (item: IListItem) => void;
  className?: string;
  number?: number;
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
      setEndsIn(
        `Ended ${endDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        })}`,
      );
      return;
    }

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      setEndsIn(`Ends in ${days}d ${hours}h`);
    } else if (hours > 0) {
      setEndsIn(`Ends in ${hours}h ${minutes}m`);
    } else {
      setEndsIn(`Ends in ${minutes}m`);
    }
  }, [giveaway]);

  const getPlaceNumber = useCallback(() => {
    switch (number) {
      case 1:
        return <img src="/top1.svg" alt="" />;
      case 2:
        return <img src="/top2.svg" alt="" />;
      case 3:
        return <img src="/top3.svg" alt="" />;
      default:
        return (
          <Text type="caption2" weight="medium">
            {number}
          </Text>
        );
    }
  }, [number]);

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
      {(logo || giveaway?.sponsors) && (
        <div className="mr-2.5 flex-shrink-0">
          <GiveawayAvatar
            // avatarUrls={
            //   giveaway?.sponsors && giveaway?.sponsors.length > 0
            //     ? giveaway?.sponsors.map((sponsor) => sponsor.avatar_url || undefined)
            //     : logo ? [String(logo)] : [undefined]
            // }

            avatars={
              giveaway?.sponsors && giveaway?.sponsors.length > 0
                ? giveaway?.sponsors.map((sponsor) => ({
                    title: sponsor.title,
                    avatar_url: sponsor.avatar_url as string,
                  }))
                : logo
                  ? [
                      {
                        title: title,
                        avatar_url: logo as string,
                      },
                    ]
                  : undefined
            }
            isMini
          />
        </div>
      )}

      <div className="flex flex-1 min-w-0 flex-col items-start">
        <div className="flex w-full items-center justify-between gap-2">
          <div className={`flex flex-1 min-w-0 flex-col ${giveaway ? "pb-2.5" : ""}`}>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                {title}
              </span>
              {/* {giveaway?.isAdmin && <AdminBadge />} */}
            </div>

            {giveaway && (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-hint text-sm-max tracking-subheadline">
                    {endsIn}
                  </span>
                </div>
              </>
            )}
          </div>

          {number && (
            <div className="bg-bg flex h-6 w-6 flex-shrink-0 aspect-square items-center justify-center rounded-full">
              {getPlaceNumber()}
            </div>
          )}
        </div>

        <Block row gap={8}>
          <div className="bg-tertiary-fill-bg flex items-center gap-1 rounded-[10px] px-1.5 py-1">
            {/* <WinnerCup /> */}

            <Text type="caption" weight="medium">
              {/* {giveaway?.winners_count} winners */}
              {giveaway?.participants} participants
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
