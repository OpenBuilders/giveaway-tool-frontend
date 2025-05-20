import type { IListItem } from "@/interfaces";
import { BottomBar } from "../components/BottomBar";
import { CreateGiveawayButton } from "../components/ui/buttons/CreateGiveawayButton";
import { List } from "../components/ui/list/List";
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api";

const items: IListItem[] = [
  {
    id: "1",
    logo: "/logo.png",
    title: "Giveaway 1",
    giveaway: {
      isAdmin: true,
      endsAt: "2023-10-01T12:00:00Z",
      participants: 10220,
      telegramUsername: "user1",
    },
  },
  {
    id: "2",
    logo: "/logo.png",
    title: "Giveaway 2",
    giveaway: {
      isAdmin: false,
      endsAt: "2025-05-15T12:00:00Z",
      participants: 200,
      telegramUsername: "user2",
    },
  },
];

export default function MainPage() {
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
        <List groupName={"active"} items={items} />
        <List groupName={"finished"} items={items} />
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
          <CreateGiveawayButton />
        </BottomBar>
      </div>
    </>
  );
}
