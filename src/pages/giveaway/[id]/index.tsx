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
  StickerPlayer,
} from "@/components/kit";
import { IListItem } from "@/interfaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { joinToGiveaway } from "@/api/giveaway.api";

import doneSticker from "@/assets/tgs/DoneSticker.json";
import winnerCupSticker from "@/assets/tgs/WinnerCupSticker.json";
import sadSticker from "@/assets/tgs/SadSticker.json";
import congratsSticker from "@/assets/tgs/CongratsSticker.json";
import { goTo } from "@/utils";

const SmallDetailsCard = ({
  title,
  value,
}: {
  title: string;
  value?: string | number;
}) => {
  return (
    <div className="bg-section-bg flex w-full flex-col items-center rounded-[12px] px-4 py-3">
      <span>{value?.toLocaleString("en-US")}</span>
      <span className="text-hint text-sm-max tracking-subheadline">
        {title}
      </span>
    </div>
  );
};

export default function GiveawayPage() {
  const { id } = useParams();

  // Track which requirements are currently being checked (loading state)
  const [checkingRequirements, setCheckingRequirements] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: giveaway } = useQuery({
    queryKey: ["giveaway", id],
    queryFn: () => giveawayApi.getGiveawayById(String(id)),
    enabled: !!id,
  });

  const { data: checkRequirements, refetch: refetchCheckRequirements } =
    useQuery({
      queryKey: ["checkRequirements", id, giveaway?.user_role],
      queryFn: () => giveawayApi.checkGiveawayRequirements(String(id)),
      enabled: !!id && giveaway?.user_role === "user",
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

  const setParticipantsInfoJoined = () => {
    setResultCardData({
      id: id!,
      title: "You’re in!",
      description:
        "Now just wait for it to end — results will be announced after the deadline.",
      logo: <StickerPlayer lottie={doneSticker} height={36} width={36} />,
    });
  };

  useEffect(() => {
    if (isAdmin) {
      const viewedGiveaways = localStorage.getItem("viewedGiveaways");
      if (viewedGiveaways) {
        const viewedGiveawaysArray = JSON.parse(viewedGiveaways);
        if (!viewedGiveawaysArray.includes(id)) {
          localStorage.setItem(
            "viewedGiveaways",
            JSON.stringify([...viewedGiveawaysArray, id]),
          );
          setAlreadyViewed(false);
        }
      } else {
        localStorage.setItem("viewedGiveaways", JSON.stringify([id]));
        setAlreadyViewed(false);
      }
    } else if (
      giveaway?.status === "completed" &&
      giveaway?.winners?.find(
        (winner) => winner.user_id === WebApp.initDataUnsafe.user?.id,
      )
    ) {
      const wonGiveaways = localStorage.getItem("wonGiveaways");
      if (wonGiveaways) {
        const wonGiveawaysArray = JSON.parse(wonGiveaways);
        if (!wonGiveawaysArray.includes(id)) {
          localStorage.setItem(
            "wonGiveaways",
            JSON.stringify([...wonGiveawaysArray, id]),
          );
          setAlreadyViewed(false);
        }
      } else {
        localStorage.setItem("wonGiveaways", JSON.stringify([id]));
        setAlreadyViewed(false);
      }
    }
  }, [id, isAdmin, giveaway]);

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
            }),
        );

        if (giveaway?.status === "completed") {
          const currentUserId = WebApp.initDataUnsafe.user?.id;
          const winner = giveaway?.winners?.find(
            (winner) => winner.user_id === currentUserId,
          );
          if (winner) {
            setResultCardData({
              id: giveaway?.id,
              title: "You won!",
              description:
                "Congratulations! You got lucky this time — your prize will be delivered soon.",
              logo: (
                <StickerPlayer
                  lottie={congratsSticker}
                  height={36}
                  width={36}
                />
              ),
            });
          } else {
            setResultCardData({
              id: giveaway?.id,
              title: "You didn’t win this time",
              description:
                "Better luck next time! Try joining another giveaway — your turn will come.",
              logo: (
                <StickerPlayer lottie={sadSticker} height={36} width={36} />
              ),
            });
          }
        } else if (giveaway?.status === "pending") {
          setResultCardData({
            id: giveaway?.id,
            title: "Winners will be announced soon",
            description:
              "Winners have been picked — check back soon to see the results.",
            logo: (
              <StickerPlayer lottie={winnerCupSticker} height={36} width={36} />
            ),
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
            }),
        );

        if (giveaway?.user_role === "participant") {
          setParticipantsInfoJoined();
        }

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
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeRemaining(
            `${days}:${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`,
          );
        } else {
          setTimeRemaining(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`,
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

      setParticipantsInfoJoined();
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
          {!alreadyViewed && <ConfettiAnimation active />}

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
                className="bg-section-bg flex w-full cursor-pointer items-center justify-between gap-4 rounded-[12px] px-4 py-2"
                onClick={() => {
                  navigator.clipboard.writeText(giveawayLink);
                  showToast({
                    message: "Link copied",
                    type: "success",
                    time: 2000,
                  });
                }}
              >
                <span className="max-w-[calc(100%-28px)] overflow-hidden text-ellipsis whitespace-nowrap">
                  {giveawayLink}
                </span>
                <div className="h-[28px] w-[28px]">
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
                logo={<div className="mr-3 h-9 w-9">{resultCardData.logo}</div>}
                className="rounded-[16px]"
                separator={false}
                rightIcon={undefined}
              />
            )}

            <div className="grid w-full grid-cols-3 gap-2.5">
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
                />
              ))}
            </List>
          </div>

          {isAdmin && (
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
                    className: `[&_img]:scale-75`,
                    rightIcon: "arrow",
                  }) as IListItem,
              )}
            />
          )}

          {giveaway?.status === "active" && !isAdmin && (
            <List
              header="joining requirements"
              items={(checkRequirements?.results ?? []).map(
                (requirement, index) =>
                  ({
                    id: index.toString(),
                    logo:
                      requirement.type === "subscription"
                        ? "/gift.svg"
                        : undefined,
                    title: requirement.name,
                    description: requirement.username,
                    rightIcon:
                      requirement.status === "success" ? (
                        "done"
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the list item click event
                            if (requirement.type === "subscription") {
                              // Set loading state for this requirement
                              setCheckingRequirements((prev) => ({
                                ...prev,
                                [index.toString()]: true,
                              }));

                              // Open the Telegram channel/chat link
                              if (requirement.username) {
                                goTo(`https://t.me/${requirement.username}`);
                              }

                              // Wait at least 3 seconds before checking
                              setTimeout(() => {
                                refetchCheckRequirements().finally(() => {
                                  // Clear loading state after check completes
                                  setCheckingRequirements((prev) => ({
                                    ...prev,
                                    [index.toString()]: false,
                                  }));
                                });
                              }, 3000); // 3-second minimum delay
                            }
                          }}
                          className="bg-button text-button-text !font-rounded text-sm-bold tracking-sm-bold flex items-center gap-1 rounded-[30px] px-3 py-1 font-semibold"
                          disabled={checkingRequirements[index.toString()]}
                        >
                          {checkingRequirements[index.toString()] ? (
                            <>
                              <span>Checking...</span>
                            </>
                          ) : requirement.type === "subscription" ? (
                            "Check"
                          ) : (
                            "Pay"
                          )}
                        </button>
                      ),
                    className: `[&_img]:scale-75`,
                  }) as IListItem,
              )}
              onItemClick={() => {
                // onItemClick is still needed for other interactions
                // but not for the subscription check button
                refetchCheckRequirements();
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
                  }) as IListItem,
              )}
            />
          )}
        </Block>
      </PageLayout>
    </>
  );
}
