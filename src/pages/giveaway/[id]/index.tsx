import { Button } from "@/components/ui/buttons/Button";
import { List } from "@/components/ui/list/List";
import { ListItem } from "@/components/ui/list/ListItem";
import { BackButton } from "@twa-dev/sdk/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { giveawayApi } from "@/api";
import { CopyIcon } from "@/assets/icons/CopyIcon";
import { ForwardIcon } from "@/assets/icons/ForwardIcon";
import WebApp from "@twa-dev/sdk";
import {
  Block,
  ConfettiAnimation,
  PageLayout,
  TelegramMainButton,
  Text,
  useToast,
  StickerPlayer,
  DialogModal,
  DialogSheet,
} from "@/components/kit";
import { IListItem } from "@/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { joinToGiveaway, updateGiveawayStatus } from "@/api/giveaway.api";

import doneSticker from "@/assets/tgs/DoneSticker.json";
import winnerCupSticker from "@/assets/tgs/WinnerCupSticker.json";
import sadSticker from "@/assets/tgs/SadSticker.json";
import congratsSticker from "@/assets/tgs/CongratsSticker.json";
import { goTo } from "@/utils";
import { GiveawayAvatar } from "@/components/ui/GiveawayAvatar";
import { UploadButton } from "@/components/ui/buttons/UploadButton";
import {
  loadPreWinnerList,
  getLoadedWinnersList,
  clearLoadedWinners,
} from "@/api/utils.api";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { getRequirementIcon, getRequirementTitle } from "@/assets/icons/helper";
// import removed: legacy prize icon logic no longer used
import { useIsConnectionRestored, useTonAddress } from "@tonconnect/ui-react";
import useWallet from "@/hooks/useWallet";
import { IUserPreviewCheckWinner } from "@/interfaces/giveaway.interface";
import { CancelButton } from "@/components/ui/buttons/CancelButton";
import { WhiteListIcon } from "@/assets/icons/requirements/WhiteListIcon";

type PrizeLike = {
  title?: string;
  description?: string;
  quantity?: number;
  place?: number;
  // legacy fallbacks
  prize_type?: string;
  fields?: unknown[];
};

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
  const queryClient = useQueryClient();

  // const [checkingRequirements, setCheckingRequirements] = useState<{
  //   [key: string]: boolean;
  // }>({});

  const { data: giveaway } = useQuery({
    queryKey: ["giveaway", id],
    queryFn: () => giveawayApi.getGiveawayById(String(id)),
    enabled: !!id,
  });

  const { data: checkRequirements, refetch: refetchCheckRequirements } =
    useQuery({
      queryKey: ["checkRequirements", id, giveaway?.user_role],
      queryFn: () => giveawayApi.checkGiveawayRequirements(String(id)),
      enabled:
        !!id && ["user", "participant"].includes(giveaway?.user_role ?? ""),
    });

  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [timeRemainingText, setTimeRemainingText] = useState<string>("");
  const [resultCardData, setResultCardData] = useState<IListItem | null>(null);
  const [alreadyViewed, setAlreadyViewed] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [preWinnerList, setPreWinnerList] = useState<
    IUserPreviewCheckWinner[] | null
  >(null);

  const [prizeSheetState, setPrizeSheetState] = useState<{
    opened: boolean;
    title: string;
    description?: string;
  }>({ opened: false, title: "", description: undefined });
  const [customReqSheetState, setCustomReqSheetState] = useState<{
    opened: boolean;
    title: string;
    description?: string;
  }>({ opened: false, title: "", description: undefined });

  const [isAdmin, setIsAdmin] = useState(giveaway?.user_role === "owner");
  const giveawayLink = `https://t.me/${
    import.meta.env.VITE_BOT_USERNAME
  }?startapp=${id}`;

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { connectWallet } = useWallet();
  const userFriendlyAddress = useTonAddress();
  const connectionRestored = useIsConnectionRestored();
  const walletConnected = !!userFriendlyAddress && connectionRestored;

  const giveawaySponsors = useMemo(() => {
    return giveaway?.sponsors && giveaway?.sponsors.length > 0
      ? giveaway?.sponsors.map((sponsor) => ({
          title: sponsor.title,
          avatar_url: sponsor.avatar_url as string,
        }))
      : undefined;
  }, [giveaway]);

  const setParticipantsInfoJoined = useCallback(() => {
    setResultCardData({
      id: id!,
      title: "You’re in!",
      description:
        "Now just wait for it to end — results will be announced after the deadline.",
      logo: <StickerPlayer lottie={doneSticker} height={36} width={36} />,
    });
  }, [id]);

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
    if (giveaway?.user_role === "participant") {
      setHasJoined(true);
    }
  }, [giveaway, setParticipantsInfoJoined]);

  useEffect(() => {
    if (!giveaway) return;

    setIsAdmin(giveaway?.user_role === "owner");

    switch (giveaway?.status) {
      case "completed":
      case "pending":
      case "custom":
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
  }, [giveaway, setParticipantsInfoJoined]);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const timeDiff = Math.max(
      0,
      giveaway?.ends_at ? new Date(giveaway?.ends_at).getTime() - now : 0,
    );

    if (timeDiff <= 0) {
      setTimeRemaining("00:00");
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    if (days > 0) {
      setTimeRemaining(
        `${days}:${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    } else {
      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    }
  }, [giveaway?.ends_at]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const hasHoldRequirement = (giveaway?.requirements ?? []).some(
    (r) => r.type === "holdton" || r.type === "holdjetton",
  );

  const { data: loadedWinnersData } = useQuery({
    queryKey: ["loadedWinners", id, giveaway?.status, isAdmin],
    queryFn: () => getLoadedWinnersList(String(id)),
    enabled: !!id && giveaway?.status === "pending" && !!isAdmin,
  });

  useEffect(() => {
    if (loadedWinnersData?.results) {
      setPreWinnerList(loadedWinnersData.results);
    }
  }, [loadedWinnersData]);

  const joinToGiveawayFetch = useMutation({
    mutationFn: ({ id }: { id: string }) => joinToGiveaway(id),
    onSuccess: () => {
      showToast({
        message: "Joined! Wait for the results",
        type: "success",
        time: 2000,
      });

      setParticipantsInfoJoined();
      setHasJoined(true);
    },
    onError: () => {
      showToast({
        message: "Complete all requirements to unlock this giveaway.",
        type: "error",
        time: 2000,
      });
    },
  });

  const loadPreWinnerListFetch = useMutation({
    mutationFn: ({ file, giveawayId }: { file: File; giveawayId: string }) =>
      loadPreWinnerList(file, giveawayId),
    onSuccess: (data) => {
      if (data.results.length > 0) {
        setPreWinnerList(data.results);
      } else {
        showToast({
          message: "No winners found in the list",
          type: "error",
          time: 2000,
        });
      }
    },
    onError: () => {
      showToast({
        message: "Failed to load winners list",
        type: "error",
        time: 2000,
      });
    },
  });

  const finishGiveawayMutation = useMutation({
    mutationFn: () => updateGiveawayStatus(String(id), "completed"),
    onSuccess: () => {
      showToast({
        message: "Giveaway finished",
        type: "success",
        time: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["giveaway", id] });
    },
    onError: () => {
      showToast({
        message: "Failed to finish giveaway",
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

      {isAdmin ? (
        false
      ) : giveaway?.status === "active" &&
        giveaway.user_role === "user" &&
        !hasJoined &&
        !prizeSheetState.opened ? (
        <TelegramMainButton
          text="Join Giveaway"
          onClick={() => {
            joinToGiveawayFetch.mutate({ id: String(id) });
          }}
        />
      ) : null}

      <DialogModal
        active={showModal}
        title="Remove Uploaded List?"
        description="Once deleted, these users will no longer be able to claim prizes. Are you sure you want to remove?"
        confirmText="Remove"
        closeText="Cancel"
        onClose={() => {
          setShowModal(false);
        }}
        onDelete={() => {
          if (!id) return;
          clearLoadedWinners(String(id))
            .then(() => {
              loadPreWinnerListFetch.reset();
              setPreWinnerList(null);
              showToast({
                message: "You removed uploaded winners list",
                type: "success",
                time: 2000,
              });
            })
            .catch(() => {
              showToast({
                message: "Failed to remove winners list",
                type: "error",
                time: 2000,
              });
            })
            .finally(() => setShowModal(false));
        }}
      />

      <DialogSheet
        opened={prizeSheetState.opened}
        onClose={() => setPrizeSheetState((s) => ({ ...s, opened: false }))}
        icon={
          <img src="/gateway_gift.png" alt="gift" width={120} height={120} />
        }
        title={prizeSheetState.title}
        description={prizeSheetState.description}
        primaryText="Understood"
      />

      <DialogSheet
        opened={customReqSheetState.opened}
        onClose={() => setCustomReqSheetState((s) => ({ ...s, opened: false }))}
        icon={<WhiteListIcon />}
        title={customReqSheetState.title}
        description={customReqSheetState.description}
        primaryText="Understood"
      />

      <PageLayout>
        <>
          {!alreadyViewed && <ConfettiAnimation active />}

          <GiveawayAvatar avatars={giveawaySponsors} />

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
                  // WebApp.shareMessage(String(giveaway?.msg_id));
                  goTo(
                    `https://t.me/share?url=${giveawayLink}&text=${giveaway?.title}`,
                  );
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

            <div className="grid w-full grid-cols-2 gap-2.5">
              <SmallDetailsCard
                title="winners"
                value={giveaway?.winners_count}
              />
              <SmallDetailsCard
                title="joined"
                value={giveaway?.participants_count}
              />
              {/* <SmallDetailsCard
                title="prize count"
                value={giveaway?.prizes.length}
              /> */}
            </div>
          </Block>
        </Block>

        <Block padding="bottom" paddingValue={32}>
          <Block margin="top" marginValue={24} gap={24}>
            <div
              className={`flex flex-col ${
                (giveaway?.prizes ?? []).length > 0 ? "gap-2.5" : ""
              }`}
            >
              <List header="prizes" className="grid grid-cols-2 gap-2.5">
                {(giveaway?.prizes ?? []).map((prize: PrizeLike, index) => {
                  // New API shape: { title, description?, quantity?, place? }
                  const newTitle = prize?.title as string | undefined;
                  const newDescription = prize?.description as
                    | string
                    | undefined;
                  const newQuantity = prize?.quantity as number | undefined;

                  // Backward compatibility with legacy shape to avoid crashes when viewing historical data
                  const legacyTitle = prize?.prize_type
                    ? prize.prize_type.charAt(0).toUpperCase() +
                      prize.prize_type.slice(1)
                    : undefined;
                  const legacyDescription = Array.isArray(prize?.fields)
                    ? `${prize.fields.length} inputs`
                    : undefined;

                  return (
                    <ListItem
                      key={index}
                      id={index.toString()}
                      logo="/gift.svg"
                      title={newTitle || legacyTitle || "Prize"}
                      // description={
                      //   newDescription ||
                      //   (typeof newQuantity === "number" && newQuantity > 0
                      //     ? `Quantity: ${newQuantity}`
                      //     : legacyDescription)
                      // }
                      className="rounded-[10px] after:h-0 [&_img]:scale-75"
                      rightIcon={undefined}
                      onClick={() => {
                        setPrizeSheetState({
                          opened: true,
                          title: newTitle || legacyTitle || "Prize",
                          description:
                            newDescription ||
                            (typeof newQuantity === "number" && newQuantity > 0
                              ? `Quantity: ${newQuantity}`
                              : legacyDescription),
                        });
                      }}
                    />
                  );
                })}
              </List>
            </div>

            {isAdmin && (
              <List
                header="joining requirements"
                items={(giveaway?.requirements ?? []).map(
                  (requirement, index) =>
                    ({
                      id: index.toString(),
                      logo: getRequirementIcon(requirement),
                      title: getRequirementTitle(requirement),
                      rightIcon: "arrow",
                      onClick: () => {
                        if (requirement.username) {
                          goTo(`https://t.me/${requirement.username}`);
                        }
                        if (requirement.url) {
                          goTo(requirement.url);
                        }
                        if (requirement.type === "custom") {
                          setCustomReqSheetState({
                            opened: true,
                            title: requirement.name || "",
                            description: requirement.description || "",
                          });
                        }
                      },
                    }) as IListItem,
                )}
              />
            )}

            {giveaway?.status === "active" && !isAdmin && (
              <List
                header="joining requirements"
                items={[
                  ...(hasHoldRequirement
                    ? [
                        {
                          id: "wallet-connect",
                          logo: getRequirementIcon({ type: "connectwallet" }),
                          title: getRequirementTitle({ type: "connectwallet" }),
                          rightIcon: walletConnected ? "done" : "arrow",
                          onClick: () => {
                            if (!walletConnected) {
                              connectWallet();
                              setTimeout(() => {
                                refetchCheckRequirements();
                              }, 3000);
                            }
                          },
                        } as IListItem,
                      ]
                    : []),
                  ...(checkRequirements?.results ?? []).map(
                    (requirement, index) =>
                      ({
                        id: index.toString(),
                        logo: getRequirementIcon(requirement),
                        title: getRequirementTitle(requirement),
                        rightIcon:
                          requirement.status === "success" ? "done" : "arrow",
                        onClick: () => {
                          if (requirement.type === "subscription") {
                            if (requirement.username) {
                              goTo(`https://t.me/${requirement.username}`);
                            }
                            if (
                              requirement?.url ||
                              requirement?.chat_info?.url
                            ) {
                              goTo(
                                requirement?.chat_info?.url ||
                                  requirement?.url ||
                                  "",
                              );
                            }
                            setTimeout(() => {
                              refetchCheckRequirements().finally(() => {
                                // noop
                              });
                            }, 3000);
                          }
                          if (requirement.type === "custom") {
                            setCustomReqSheetState({
                              opened: true,
                              title: requirement.name,
                              description: requirement.description || "",
                            });
                          }
                        },
                      }) as IListItem,
                  ),
                ]}
              />
            )}

            {isAdmin && giveaway?.status === "pending" && (
              <List
                header={`winners (${giveaway?.winners_count} users)`}
                className="bg-section-bg"
              >
                <ListItem
                  id="1"
                  title="Winners will appear here soon"
                  description="Upload your list before the results are finalized. Supported formats: .txt"
                />

                {preWinnerList && preWinnerList.length > 0 ? (
                  <button
                    type="button"
                    className={`text-destructive w-full cursor-pointer px-4 py-2.5 text-left`}
                    onClick={() => setShowModal(true)}
                  >
                    Remove Winners List
                  </button>
                ) : (
                  <UploadButton
                    className="px-4 py-2.5"
                    allowedFileTypes=".txt"
                    label="Upload Winners List"
                    isLoading={loadPreWinnerListFetch.isPending}
                    onSuccess={(file) => {
                      const { file: filePayload } = file;
                      loadPreWinnerListFetch.mutate({
                        file: filePayload,
                        giveawayId: String(id),
                      });
                    }}
                    onError={(err) => {
                      showToast({
                        message: String(err),
                        type: "error",
                        time: 2000,
                      });
                    }}
                  />
                )}

                {preWinnerList &&
                  preWinnerList.length > 0 &&
                  preWinnerList
                    .slice(0, showMore ? preWinnerList.length : 10)
                    .map((item, index) => (
                      <ListItem
                        id={index.toString()}
                        title={
                          item.name || item.username || item.user_id.toString()
                        }
                        logo={item.avatar_url || "/gift.svg"}
                        rightIcon={item?.prizes?.[0].title || ""}
                        className="[&_.rightSide]:text-hint"
                        separator={index < preWinnerList.length - 1}
                      />
                    ))}

                {preWinnerList && preWinnerList.length >= 10 && (
                  <button
                    type="button"
                    className="text-accent-text flex cursor-pointer items-center px-4 py-2.5 text-left"
                    onClick={() => {
                      setShowMore((prev) => !prev);
                    }}
                  >
                    <div
                      className={`text-accent-text flex w-10 items-center justify-center [&_svg]:scale-125 ${
                        showMore ? "rotate-270" : "rotate-90"
                      }`}
                    >
                      <ArrowIcon isCustomColor />
                    </div>
                    {showMore ? "Show Less" : "Show More"}
                  </button>
                )}
              </List>
            )}

            {giveaway?.winners && giveaway?.winners.length > 0 && (
              <List
                header={`winners (${giveaway?.winners.length} users)`}
                beforeList={
                  giveaway.user_role === "winner" && (
                    <ListItem
                      id="1"
                      title="You"
                      logo={WebApp.initDataUnsafe.user?.photo_url}
                      rightIcon={
                        giveaway.winners.findIndex(
                          (winner) =>
                            winner.user_id === WebApp.initDataUnsafe.user?.id,
                        ) + 1
                      }
                    />
                  )
                }
                winners={giveaway?.winners?.map(
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
                      isArrow: isAdmin,
                    }) as IListItem,
                )}
              />
            )}

            {giveaway?.sponsors && giveaway?.sponsors.length > 0 && (
              <List
                header={"creators"}
                items={giveaway?.sponsors.map(
                  (sponsor, index) =>
                    ({
                      id: index.toString(),
                      logo: (
                        <ChannelAvatar
                          title={sponsor.title}
                          avatar_url={sponsor.avatar_url}
                        />
                      ),
                      title: sponsor.username || sponsor.title,
                      rightIcon: "arrow",
                      onClick: () => {
                        if (sponsor.url) goTo(sponsor.url);
                      },
                    }) as IListItem,
                )}
              />
            )}

            {isAdmin && giveaway?.status === "pending" && (
              <div
                className={`bg-section-bg border-giveaway flex max-h-[44px] w-full items-center justify-between rounded-[10px] px-4 py-2`}
              >
                <CancelButton
                  disabled={
                    !(preWinnerList && preWinnerList.length > 0) ||
                    finishGiveawayMutation.isPending
                  }
                  onClick={() => finishGiveawayMutation.mutate()}
                >
                  Cancel Giveaway
                </CancelButton>
              </div>
            )}
          </Block>
        </Block>
      </PageLayout>
    </>
  );
}
