import { List } from "../components/ui/list/List";
import { useNavigate } from "react-router";
import { useTabs } from "@/hooks/useTabs";
import { useQuery } from "@tanstack/react-query";
import { getMyGiveaways, getTopGiveaways } from "@/api/giveaway.api";
import {
  PageLayout,
  TelegramMainButton,
  Block,
  Text,
  StickerPlayer,
} from "@kit";
import giftLottie from "@assets/tgs/gift.json";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { ConnectWalletButton } from "@/components/ui/buttons/ConnectWalletButton";

export default function MainPage() {
  const navigate = useNavigate();

  const { data: myGiveaways } = useQuery({
    queryKey: ["my-giveaways"],
    queryFn: getMyGiveaways,
    refetchOnMount: "always",
    select: (data) =>
      data.map((g) => ({
        ...g,
        description: undefined,
        giveaway: {
          isAdmin: g.user_role === "owner",
          endsAt: g.ends_at,
          participants: g.participants_count,
          requirements: g.requirements,
          winners_count: g.winners_count,
          sponsors: g.sponsors,
        },
      })),
  });

  const { data: topGiveaways } = useQuery({
    queryKey: ["top-giveaways"],
    queryFn: getTopGiveaways,
    refetchOnMount: "always",
    select: (data) =>
      data
        ?.filter((g) => g.status === "active")
        ?.map((g) => ({
          ...g,
          description: undefined,
          giveaway: {
            isAdmin: g.user_role === "owner",
            endsAt: g.ends_at,
            participants: g.participants_count,
            requirements: g.requirements,
            winners_count: g.winners_count,
            sponsors: g.sponsors,
          },
        })),
  });

  const myActiveGiveaways =
    myGiveaways?.filter((g) => g.status === "active") ?? [];
  const myFinishedGiveaways =
    myGiveaways?.filter(
      (g) => g.status === "cancelled" || g.status === "completed",
    ) ?? [];
  const myPausedGiveaways =
    myGiveaways?.filter((g) => g.status === "paused") ?? [];
  const myDeletedGiveaways =
    myGiveaways?.filter((g) => g.status === "deleted") ?? [];

  const noGiveawaysYet = (
    <div className="flex h-[45vh] items-center justify-center">
      <Block gap={6}>
        <Text type="title2" align="center" weight="semibold">
          No Giveaways Yet
        </Text>
        <Text type="text" align="center">
          Create one now — it’ll show up here!
        </Text>
      </Block>
    </div>
  );
  const { TabContent, TabsComponent } = useTabs({
    tabs: [
      {
        key: "top-100",
        label: "TOP-100",
        content: (
          <>
            {topGiveaways && topGiveaways?.length > 0 ? (
              <List
                giveaways={topGiveaways}
                onItemClick={({ id }) => {
                  navigate(`/giveaway/${id}`);
                }}
                isTopList
              />
            ) : (
              noGiveawaysYet
            )}
          </>
        ),
      },
      {
        key: "my-giveaways",
        label: "My Giveaways",
        content: (
          <>
            {myActiveGiveaways.length > 0 || myFinishedGiveaways.length > 0 ? (
              <Block gap={24}>
                <List
                  header="active"
                  giveaways={myActiveGiveaways}
                  onItemClick={({ id }) => {
                    navigate(`/giveaway/${id}`);
                  }}
                />
                <List
                  header="stopped"
                  giveaways={myPausedGiveaways}
                  onItemClick={({ id }) => {
                    navigate(`/giveaway/${id}`);
                  }}
                />
                <List
                  header="finished"
                  giveaways={myFinishedGiveaways}
                  onItemClick={({ id }) => {
                    navigate(`/giveaway/${id}`);
                  }}
                />
                <List
                  header="deleted"
                  giveaways={myDeletedGiveaways}
                  onItemClick={({ id }) => {
                    navigate(`/giveaway/${id}`);
                  }}
                />
              </Block>
            ) : (
              noGiveawaysYet
            )}
          </>
        ),
      },
    ],
  });

  useEffect(() => {
    if (WebApp.initDataUnsafe.start_param) {
      navigate(`/giveaway/${WebApp.initDataUnsafe.start_param}`);
      WebApp.initDataUnsafe.start_param = "";
    }
  }, [navigate]);

  return (
    <>
      <TelegramMainButton
        text="Create Giveaway"
        onClick={() => navigate("/giveaway/setup")}
      />

      <PageLayout>
        {/* <Header /> */}
        <Block padding="full" paddingValue={10} align="end">
          <ConnectWalletButton />
        </Block>

        <Block padding="full" paddingValue={24} align="center">
          <Block align="center">
            <StickerPlayer lottie={giftLottie} height={112} width={112} />
          </Block>

          <Block margin="top" marginValue={8}>
            <Text type="title" align="center" weight="bold">
              Create and Join <br /> Giveaways in Telegram
            </Text>
          </Block>
        </Block>

        <Block>
          <TabsComponent />

          <Block margin="top" marginValue={12}>
            <TabContent />
          </Block>
        </Block>

        <div className="flex h-full flex-1 items-end">
          <Block padding="full" paddingValue={12} align="end">
            <Text align="center" type="caption" color="tertiary">
              This is open source contributed by independent
              <br />
              developers, as part of
              <Text
                type="caption"
                href="https://tools.tg"
                color="accent"
                as="a"
              >
                {" "}
                Telegram Tools
              </Text>
            </Text>
          </Block>
        </div>
      </PageLayout>
    </>
  );
}
