import { List } from "../components/ui/list/List";
import { useNavigate } from "react-router";
import { useTabs } from "@/hooks/useTabs";
import { useQuery } from "@tanstack/react-query";
import { getMyGiveaways } from "@/api/giveaway.api";
import { PageLayout, TelegramMainButton, Image, Block, Text } from "@kit";

export default function MainPage() {
  const navigate = useNavigate();

  const { data: myGiveaways } = useQuery({
    queryKey: ["my-giveaways"],
    queryFn: getMyGiveaways,
    refetchOnMount: "always",
  });

  const mappedGiveaways = myGiveaways?.map((g) => ({
    ...g,
    description: undefined,
    giveaway: {
      isAdmin: g.can_edit,
      endsAt: g.ends_at,
      participants: g.participants_count,
      requirements: g.requirements,
    },
  }));

  const top100Giveaways =
    mappedGiveaways?.filter((g) => g.status === "active") ?? [];
  const myActiveGiveaways =
    mappedGiveaways?.filter((g) => g.status === "active") ?? [];
  const myCancelledGiveaways =
    mappedGiveaways?.filter((g) => g.status === "cancelled") ?? [];

  const { TabContent, TabsComponent } = useTabs({
    tabs: [
      {
        key: "top-100",
        label: "TOP-100",
        content: (
          <>
            {top100Giveaways.length > 0 ? (
              <List
                header="active"
                giveaways={top100Giveaways}
                onItemClick={({ id }) => {
                  navigate(`/giveaway/${id}`);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-[45vh]">
                <Block gap={6}>
                  <Text type="text" align="center" weight="medium">
                    No Giveaways Yet
                  </Text>
                  <Text type="caption" align="center">
                    Create one now — it’ll show up here!
                  </Text>
                </Block>
              </div>
            )}
          </>
        ),
      },
      {
        key: "my-giveaways",
        label: "My Giveaways",
        content: (
          <>
            {myActiveGiveaways.length > 0 || myCancelledGiveaways.length > 0 ? (
              <>
                <List
                  header="active"
                  giveaways={myActiveGiveaways}
                  onItemClick={({ id }) => {
                    navigate(`/giveaway/${id}`);
                  }}
                />
                <List
                  header="finished"
                  giveaways={myCancelledGiveaways}
                  onItemClick={({ id }) => {
                    navigate(`/giveaway/${id}`);
                  }}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-[45vh]">
                <Block gap={6}>
                  <Text type="text" align="center" weight="medium">
                    No Giveaways Yet
                  </Text>
                  <Text type="caption" align="center">
                    Create one now — it’ll show up here!
                  </Text>
                </Block>
              </div>
            )}
          </>
        ),
      },
    ],
  });

  return (
    <>
      <TelegramMainButton
        text="Create Giveaway"
        onClick={() => navigate("/giveaway/setup")}
      />

      <PageLayout>
        <Image
          size={112}
          src="/gift.svg"
          borderRadius={50}
          fallback={"Giveaway"}
        />

        <Block margin="top" marginValue={8}>
          <Text type="title" align="center" weight="bold">
            Create and Join <br /> Giveaways in Telegram
          </Text>
        </Block>

        <Block margin="top" marginValue={24}>
          <TabsComponent />

          <Block margin="top" marginValue={24}>
            <TabContent />
          </Block>
        </Block>

        <Block margin="top" marginValue="auto" fixed={"bottom"}>
          <Text align="center" type="caption" color="tertiary">
            This is open source contributed by independent
            <br />
            developers, as part of
            <Text
              type="caption"
              href="https://tools.tg"
              color="accent"
              as="span"
            >
              {" "}
              Telegram Tools
            </Text>
          </Text>
        </Block>
      </PageLayout>
    </>
  );
}
