import { Button } from "@/components/ui/buttons/Button";
import { List } from "@/components/ui/list/List";
import { ListItem } from "@/components/ui/list/ListItem";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { giveawayApi } from "@/api";
import { CopyIcon } from "@/assets/icons/CopyIcon";
import { ForwardIcon } from "@/assets/icons/ForwardIcon";
import WebApp from "@twa-dev/sdk";
import {
  Image,
  Block,
  ConfettiAnimation,
  PageLayout,
  TelegramMainButton,
  Text,
  useToast,
} from "@/components/kit";
import { IListItem } from "@/interfaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { joinToGiveaway } from "@/api/giveaway.api";

const SmallDetailsCard = ({
  title,
  value,
}: {
  title: string;
  value?: string | number;
}) => {
  return (
    <div className="flex flex-col items-center w-full px-4 py-3 rounded-[12px] bg-card-bg">
      <span>{value?.toLocaleString("en-US")}</span>
      <span className="text-text-secondary text-sm-max tracking-subheadline">
        {title}
      </span>
    </div>
  );
};

export default function GiveawayPage() {
  const { id } = useParams();

  const { data: giveaway } = useQuery({
    queryKey: ["giveaway", id],
    queryFn: () => giveawayApi.getGiveawayById(String(id)),
  });

  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [alreadyViewed, setAlreadyViewed] = useState(true);

  const isAdmin = giveaway?.user_role === "owner";
  const giveawayLink = `https://t.me/${
    import.meta.env.VITE_BOT_USERNAME
  }?startapp=${id}`;

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      const viewedGiveaways = localStorage.getItem("viewedGiveaways");
      if (viewedGiveaways) {
        const viewedGiveawaysArray = JSON.parse(viewedGiveaways);
        if (!viewedGiveawaysArray.includes(id)) {
          localStorage.setItem(
            "viewedGiveaways",
            JSON.stringify([...viewedGiveawaysArray, id])
          );
          setAlreadyViewed(false);
        }
      } else {
        localStorage.setItem("viewedGiveaways", JSON.stringify([id]));
        setAlreadyViewed(false);
      }
    }
  }, [id, isAdmin]);

  useEffect(() => {
    if (giveaway?.ends_at) {
      const endTime = new Date(giveaway.ends_at).getTime();

      const updateTimer = () => {
        const now = Date.now();
        const timeDiff = Math.max(0, endTime - now);

        if (timeDiff <= 0) {
          setTimeRemaining("00:00");
          return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeRemaining(
            `${days}:${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`
          );
        } else {
          setTimeRemaining(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`
          );
        }
      };

      updateTimer();

      const interval = setInterval(updateTimer, 60000);

      return () => clearInterval(interval);
    }
  }, [giveaway]);

  const joinToGiveawayFetch = useMutation({
    mutationFn: ({ id }: { id: string }) => joinToGiveaway(id),
    onSuccess: () => {
      showToast({
        message: "Joined to giveaway",
        type: "success",
        time: 2000,
      });
    },
    onError: () => {
      showToast({
        message: "Failed to join to giveaway",
        type: "error",
        time: 2000,
      });
    },
  });

  return (
    <>
      <BackButton
        onClick={() => {
          navigate("/");
        }}
      />
      <TelegramMainButton
        text="Join Giveaway"
        onClick={() => {
          joinToGiveawayFetch.mutate({ id: String(id) });
        }}
        isVisible={!isAdmin}
      />

      <PageLayout>
        <>
          {isAdmin && !alreadyViewed && <ConfettiAnimation active />}

          <Image
            size={112}
            src="/gift.svg"
            borderRadius={50}
            fallback={"Giveaway"}
          />

          <Block margin="top" marginValue={8}>
            <Text type="title" align="center" weight="bold">
              {giveaway?.title}
            </Text>

            <div className="flex flex-col items-center justify-center">
              <span className="text-timer-bold">
                {timeRemaining || "00:00"}
              </span>
              <span className="tracking-body font-medium">
                until end{" "}
                {new Date(giveaway?.ends_at || "").toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  ...(new Date().toDateString() ===
                  new Date(giveaway?.ends_at || "").toDateString()
                    ? {}
                    : {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      }),
                })}
              </span>
            </div>
          </Block>
        </>

        <Block gap={24} margin="top" marginValue={24}>
          {isAdmin && (
            <Block gap={12}>
              <div
                className="bg-card-bg rounded-[12px] py-2 px-4 w-full cursor-pointer flex items-center justify-between gap-4"
                onClick={() => {
                  navigator.clipboard.writeText(giveawayLink);
                  showToast({
                    message: "Link copied to clipboard",
                    type: "success",
                    time: 2000,
                  });
                }}
              >
                <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-28px)]">
                  {giveawayLink}
                </span>
                <div className="w-[28px] h-[28px]">
                  <CopyIcon />
                </div>
              </div>

              <Button
                onClick={() => {
                  WebApp.shareMessage(String(giveaway?.msg_id));
                }}
                className="flex items-center justify-center gap-1.5"
              >
                <ForwardIcon />
                Share to Channel
              </Button>
            </Block>
          )}

          <div className="grid grid-cols-3 gap-2.5 w-full">
            <SmallDetailsCard title="winners" value={giveaway?.winners_count} />
            <SmallDetailsCard
              title="joined"
              value={giveaway?.participants_count}
            />
            <SmallDetailsCard
              title="prize count"
              value={giveaway?.prizes.length}
            />
          </div>
        </Block>

        <Block margin="top" marginValue={24} gap={24}>
          <div
            className={`flex flex-col ${
              (giveaway?.prizes ?? []).length > 0 ? "gap-2.5" : ""
            }`}
          >
            <List header="prizes" className="grid grid-cols-2 gap-2.5">
              {(giveaway?.prizes ?? []).map((prize, index) => (
                <ListItem
                  id={index.toString()}
                  logo={prize.prize_type === "custom" ? "/gift.svg" : undefined}
                  title={
                    prize.prize_type.charAt(0).toUpperCase() +
                    prize.prize_type.slice(1)
                  }
                  description={`${prize.fields.length} inputs`}
                  onClick={() => {
                    navigate(`/giveaway/setup/prize/${index}`);
                  }}
                  className="rounded-[10px] after:h-0 [&_img]:scale-75"
                  isArrow={false}
                />
              ))}
            </List>
          </div>

          <List
            header="joining requirements"
            items={(giveaway?.requirements ?? []).map(
              (requirement, index) =>
                ({
                  id: index.toString(),
                  logo:
                    requirement.type === "subscription"
                      ? "/gift.svg"
                      : undefined,
                  title: requirement.name,
                  description: requirement.value,
                  className: "[&_img]:scale-75",
                } as IListItem)
            )}
            onItemClick={({ id }) => {
              navigate(`/giveaway/setup/requirement/${id}`);
            }}
          />
        </Block>
      </PageLayout>
    </>
  );
}
