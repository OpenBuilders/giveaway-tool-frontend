import { BottomBar } from "@/components/BottomBar";
import { Layout } from "@/components/Layout";
import { AddButton } from "@/components/ui/buttons/AddButton";
import { CreateGiveawayButton } from "@/components/ui/buttons/CreateGiveawayButton";
import { LabeledInput, Input } from "@/components/ui/inputs/Input";
import { Select } from "@/components/ui/inputs/SelectInput";
import { List } from "@/components/ui/list/List";
import { ListItem } from "@/components/ui/list/ListItem";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { IListItem } from "@/interfaces";
import { useMutation } from "@tanstack/react-query";
import type {
  IGiveaway,
  IGiveawayCreateRequest,
} from "@/interfaces/giveaway.interface";
import { giveawayApi } from "@/api";
import { CopyIcon } from "@/assets/icons/CopyIcon";
import { ForwardIcon } from "@/assets/icons/ForwardIcon";
import WebApp from "@twa-dev/sdk";

export default function GiveawaySetUpPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [pageState, setPageState] = useState<"default" | "created">("default");
  const [createdGiveaway, setCreatedGiveaway] = useState<
    (IGiveaway & { msg_id?: string }) | null
  >(null);
  const giveawayLink = `https://t.me/${
    import.meta.env.VITE_BOT_USERNAME
  }?startapp=${createdGiveaway?.id}`;
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const {
    title,
    setTitle,

    duration,
    setDuration,

    winners_count,
    setWinners,

    prizes,
    requirements,
    reset,
  } = useGiveawayStore((state) => state);
  const navigate = useNavigate();

  const createGiveawayFetch = useMutation({
    mutationFn: async (data: IGiveawayCreateRequest) =>
      await giveawayApi.createGiveaway(data),
    onSuccess: (data) => {
      // navigate("/giveaway/created");
      // reset();
      setPageState("created");
      setCreatedGiveaway(data);
    },
    onError: () => {
      alert("Error creating giveaway");
    },
  });

  const handleClick = () => {
    createGiveawayFetch.mutate({
      title,
      winners_count,
      duration,
      description: "Giveaway Description",
      prizes: prizes.map((prize, index) => ({
        place: index + 1,
        fields: prize.fields,
        prize_type: prize.type,
      })),
    });
  };

  useEffect(() => {
    if (winners_count > 0 && prizes.length > 0 && title.length > 0) {
      setCreateButtonDisabled(false);
    } else {
      setCreateButtonDisabled(true);
    }
  }, [winners_count, prizes, title]);

  useEffect(() => {
    if (createdGiveaway?.ends_at) {
      const endTime = new Date(createdGiveaway.ends_at).getTime();
      console.log(endTime);

      const updateTimer = () => {
        const now = Date.now();
        const timeDiff = Math.max(0, endTime - now);

        console.log(timeDiff);

        // if (timeDiff <= 0) {
        //   setTimeRemaining("00:00");
        //   return;
        // }

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

      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [createdGiveaway]);

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

  return (
    <>
      <BackButton
        onClick={() => {
          navigate("/");
          setCreateButtonDisabled(true);
          reset();
        }}
      />

      <Layout
        title={pageState === "created" ? title : "Set Up Giveaway"}
        icon={pageState === "created" ? "/gift.svg" : undefined}
        titleSpace={pageState === "default"}
      >
        {pageState === "default" && (
          <>
            <Input
              label="Title"
              placeholder="Name"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              type="text"
            />

            <LabeledInput
              label="Winners"
              placeholder="0"
              value={winners_count > 0 ? winners_count.toString() : undefined}
              onChange={(e) => {
                setWinners(parseInt(e.target.value.replace(",", "")) || 0);
              }}
              type="text"
              additionalLabel="users"
            />

            <Select
              label="Duration"
              options={[
                { label: "1 hour", value: 60 },
                { label: "1 day", value: 60 * 24 },
                { label: "1 week", value: 60 * 24 * 7 },
                { label: "1 month", value: 60 * 24 * 30 },
              ]}
              selectedValue={duration}
              onChange={(value) => {
                setDuration(Number(value));
              }}
              className="w-full"
            />
          </>
        )}

        {pageState === "created" && (
          <div className="flex flex-col items-center justify-center -mt-4 gap-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-timer-bold">
                {timeRemaining || "00:00"}
              </span>
              <span className="tracking-body font-medium">
                until end{" "}
                {new Date(createdGiveaway?.ends_at || "").toLocaleString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    ...(new Date().toDateString() ===
                    new Date(createdGiveaway?.ends_at || "").toDateString()
                      ? {}
                      : {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        }),
                  }
                )}
              </span>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div
                className="bg-card-bg rounded-[12px] py-2 px-4 w-full cursor-pointer flex items-center justify-between gap-4"
                onClick={() => {
                  navigator.clipboard.writeText(giveawayLink);
                }}
              >
                <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-28px)]">
                  {giveawayLink}
                </span>
                <CopyIcon />
              </div>

              <CreateGiveawayButton
                onClick={() => {
                  WebApp.shareMessage(String(createdGiveaway?.msg_id));
                }}
                className="flex items-center justify-center gap-1.5"
              >
                <ForwardIcon />
                Share to Channel
              </CreateGiveawayButton>
            </div>

            <div className="grid grid-cols-3 gap-2.5 w-full">
              <SmallDetailsCard
                title="winners"
                value={createdGiveaway?.winners_count}
              />
              <SmallDetailsCard
                title="joined"
                value={createdGiveaway?.participants_count}
              />
              <SmallDetailsCard
                title="duration"
                value={duration + "s"}
              />
            </div>
          </div>
        )}

        <div className={`flex flex-col ${prizes.length > 0 ? "gap-2.5" : ""}`}>
          <List groupName="prizes" className="grid grid-cols-2 gap-2.5">
            {prizes.map((prize, index) => (
              <ListItem
                id={index.toString()}
                logo={prize.type === "custom" ? "/gift.svg" : undefined}
                title={prize.type.charAt(0).toUpperCase() + prize.type.slice(1)}
                description={`${prize.fields.length} inputs`}
                onClick={() => {
                  navigate(`/giveaway/setup/prize/${index}`);
                }}
                className="rounded-[10px] after:h-0 [&_img]:scale-75"
                isArrow={false}
              />
            ))}
          </List>

          {pageState === "default" && (
            <div className="py-2 px-4 max-h-[44px] items-center flex bg-white w-full justify-between border-giveaway rounded-[10px]">
              <AddButton
                onClick={() => {
                  navigate("/giveaway/setup/prize");
                }}
              >
                Add Prize
              </AddButton>
            </div>
          )}
        </div>

        <List
          groupName="joining requirements"
          items={requirements.map(
            (requirement, index) =>
              ({
                id: index.toString(),
                logo:
                  requirement.type === "subscription" ? "/gift.svg" : undefined,
                title: requirement.name,
                description: requirement.value,
                className: "[&_img]:scale-75",
              } as IListItem)
          )}
          onItemClick={({ id }) => {
            navigate(`/giveaway/setup/requirement/${id}`);
          }}
          addButton={
            pageState === "default" && (
              <AddButton
                onClick={() => {
                  navigate("/giveaway/setup/requirement");
                }}
              >
                Add Requirement
              </AddButton>
            )
          }
        />
      </Layout>

      {/* <main className="flex flex-col justify-between h-full overflow-y-auto">
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <h1 className="text-title text-3xl font-bold tracking-title px-6 py-10">
            Set Up Giveaway
          </h1> *

          <div className="flex flex-col gap-6 w-full">
            
          </div>
        </div>
      </main> */}

      <div className="flex flex-col">
        <BottomBar>
          <CreateGiveawayButton
            disabled={createButtonDisabled}
            onClick={handleClick}
          />
        </BottomBar>
      </div>
    </>
  );
}
