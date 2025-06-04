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
import { WinnerCup } from "@/assets/icons/WinnerCup";
import { DoneIcon } from "@/assets/icons/DoneIcon";

const SmallDetailsCard = ({
  title,
  value,
}: {
  title: string;
  value?: string | number;
}) => {
  return (
    <div className="flex flex-col items-center w-full px-4 py-3 rounded-[12px] bg-section-bg">
      <span>{value?.toLocaleString("en-US")}</span>
      <span className="text-h text-sm-max tracking-subheadline">
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
  const [timeRemainingText, setTimeRemainingText] = useState<string>("");
  const [resultCardData, setResultCardData] = useState<IListItem | null>(null);
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
    switch (giveaway?.status) {
      case "completed":
      case "pending":
        setTimeRemaining("Ended");
        setTimeRemainingText(
          "on " +
            new Date(giveaway?.ends_at || "").toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              ...(new Date().toDateString() ===
              new Date(giveaway?.ends_at || "").toDateString()
                ? {}
                : {
                    month: "short",
                    day: "numeric",
                  }),
            })
        );

        if (giveaway?.status === "completed") {
          const currentUserId = WebApp.initDataUnsafe.user?.id;
          const winner = giveaway?.winners.find(
            (winner) => winner.user_id === currentUserId
          );
          if (winner) {
            setResultCardData({
              id: giveaway?.id,
              title: "You’re in!",
              description:
                "Now just wait for it to end — results will be announced after the deadline.",
              logo: <DoneIcon />,
            });
          }
        } else if (giveaway?.status === "pending") {
          setResultCardData({
            id: giveaway?.id,
            title: "Winners will be announced soon",
            description:
              "Winners have been picked — check back soon to see the results.",
            logo: <WinnerCup />,
          });
        }

        return;
      case "paused":
        setTimeRemaining("Stopped");
        setTimeRemainingText("you can resume it anytime");

        return;
      case "active":
        setTimeRemainingText(
          "until end " +
            (new Date().toDateString() ===
            new Date(giveaway?.ends_at || "").toDateString()
              ? "today at "
              : "") +
            new Date(giveaway?.ends_at || "").toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              ...(new Date().toDateString() ===
              new Date(giveaway?.ends_at || "").toDateString()
                ? {}
                : {
                    // weekday: "long",
                    month: "short",
                    day: "numeric",
                  }),
            })
        );
        break;
      default:
        setTimeRemaining("Ended");
    }

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
        message: "Joined! Wait for the results",
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
        isVisible={isAdmin ? false : giveaway?.status === "active"}
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
                {timeRemainingText}
              </span>
            </div>
          </Block>
        </>

        <Block gap={24} margin="top" marginValue={24}>
          {isAdmin && (
            <Block gap={12}>
              <div
                className="bg-section-bg rounded-[12px] py-2 px-4 w-full cursor-pointer flex items-center justify-between gap-4"
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

          <Block gap={10}>
            {resultCardData && !isAdmin && (
              <ListItem
                id={resultCardData.id}
                title={resultCardData.title}
                description={resultCardData.description}
                logo={
                  <div className="[&_svg]:w-9 [&_svg]:h-9 mr-3">
                    {resultCardData.logo}
                  </div>
                }
                className="rounded-[16px]"
                separator={false}
                isArrow={false}
              />
            )}

            <div className="grid grid-cols-3 gap-2.5 w-full">
              <SmallDetailsCard
                title="winners"
                value={giveaway?.winners_count}
              />
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

          {giveaway?.status === "active" && (
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
                    title: `Subscribe to ${requirement.name}`,
                    description: `Not completed`,
                    className: `[&_img]:scale-75 ${
                      // only if already completed
                      requirement.type === "subscription"
                        ? "[&_span.description]:text-accent-text"
                        : ""
                    }`,
                  } as IListItem)
              )}
              onItemClick={() => {
                // check valid
              }}
            />
          )}

          {giveaway?.winners && giveaway?.winners.length > 0 && (
            <List
              header={`winners (${giveaway?.winners.length} users)`}
              winners={giveaway?.winners.map(
                (winner, index) =>
                  ({
                    id: index.toString(),
                    logo: "/gift.svg",
                    title: winner.username,
                    winner: {
                      place: winner.place,
                      isWinner:
                        WebApp.initDataUnsafe.user?.id === winner.user_id,
                    },
                    className: "[&_img]:scale-75",
                    isArrow: isAdmin,
                  } as IListItem)
              )}
            />
          )}
        </Block>
      </PageLayout>
    </>
  );
}
