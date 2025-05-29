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

export default function GiveawaySetUpPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);

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

  useEffect(() => {
    if (winners_count > 0 && prizes.length > 0 && title.length > 0) {
      setCreateButtonDisabled(false);
    } else {
      setCreateButtonDisabled(true);
    }
  }, [winners_count, prizes, title]);

  return (
    <>
      <BackButton
        onClick={() => {
          navigate(-1);
          setCreateButtonDisabled(true);
          reset();
        }}
      />

      <Layout title="Set Up Giveaway" titleSpace>
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

          <div className="py-2 px-4 max-h-[44px] items-center flex bg-white w-full justify-between border-giveaway rounded-[10px]">
            <AddButton
              onClick={() => {
                navigate("/giveaway/setup/prize");
              }}
            >
              Add Prize
            </AddButton>
          </div>
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
            <AddButton
              onClick={() => {
                navigate("/giveaway/setup/requirement");
              }}
            >
              Add Requirement
            </AddButton>
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
          <CreateGiveawayButton disabled={createButtonDisabled} />
        </BottomBar>
      </div>
    </>
  );
}
