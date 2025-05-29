import { BottomBar } from "../components/BottomBar";
import { CreateGiveawayButton } from "../components/ui/buttons/CreateGiveawayButton";
import { List } from "../components/ui/list/List";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router";
import { useTabs } from "@/hooks/useTabs";
import { useQuery } from "@tanstack/react-query";
import { getMyGiveaways } from "@/api/giveaway.api";

export default function MainPage() {
  const navigate = useNavigate();

  const { data: myGiveaways } = useQuery({
    queryKey: ["my-giveaways"],
    queryFn: () => getMyGiveaways(),
  });

  const { TabContent, TabsComponent } = useTabs({
    tabs: [
      {
        key: "top-100",
        label: "TOP-100",
        content: (
          <List
            giveaways={
              myGiveaways
                ?.filter((g) => g.status === "active")
                ?.map((g) => ({
                  ...g,
                  description: undefined,
                  giveaway: {
                    isAdmin: g.can_edit,
                    endsAt: g.ends_at,
                    participants: g.participants_count,
                    requirements: g.requirements,
                  },
                })) || []
            }
          />
        ),
      },
      {
        key: "my-giveaways",
        label: "My Giveaways",
        content: (
          <>
            <List
              groupName={"active"}
              giveaways={
                myGiveaways
                  ?.filter((g) => g.status === "active")
                  ?.map((g) => ({
                    ...g,
                    description: undefined,
                    giveaway: {
                      isAdmin: g.can_edit,
                      endsAt: g.ends_at,
                      participants: g.participants_count,
                      requirements: g.requirements,
                    },
                  })) || []
              }
            />
            <List
              groupName={"finished"}
              giveaways={
                myGiveaways
                  ?.filter((g) => g.status === "cancelled")
                  ?.map((g) => ({
                    ...g,
                    description: undefined,
                    giveaway: {
                      isAdmin: g.can_edit,
                      endsAt: g.ends_at,
                      participants: g.participants_count,
                      requirements: g.requirements,
                    },
                  })) || []
              }
            />
          </>
        ),
      },
    ],
  });

  return (
    <>
      <Layout
        icon="/gift.svg"
        title={
          <>
            Create and Join <br /> Giveaways in Telegram
          </>
        }
        // description={
        //   <>
        //     Set up your own Giveaway in seconds — <br /> or take part in others
        //     to win rewards <br /> and engage with the community.
        //   </>
        // }
      >
        <TabsComponent />

        <TabContent />
      </Layout>

      <div className="flex flex-col">
        <p className="text-center text-subtitle text-sm tracking-footnote py-3">
          This is open source contributed by independent <br /> developers, as
          part of{" "}
          <a href="" className="text-link">
            Telegram Tools
          </a>
        </p>

        <BottomBar>
          <CreateGiveawayButton onClick={() => navigate("/giveaway/setup")} />
        </BottomBar>
      </div>
    </>
  );
}
