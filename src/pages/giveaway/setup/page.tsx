import { BottomBar } from "@/components/BottomBar";
import { Layout } from "@/components/Layout";
import { AddButton } from "@/components/ui/buttons/AddButton";
import { CreateGiveawayButton } from "@/components/ui/buttons/CreateGiveawayButton";
import { LabeledInput } from "@/components/ui/inputs/Input";
import { Select } from "@/components/ui/inputs/SelectInput";
import { List } from "@/components/ui/list/List";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function GiveawaySetUpPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);

  const {
    duration,
    setDuration,

    winners,
    setWinners,

    prizes,
    addEmptyPrize,

    reset,
  } = useGiveawayStore((state) => state);

  const navigate = useNavigate();

  useEffect(() => {
    if (winners > 0 && prizes.length > 0) {
      setCreateButtonDisabled(false);
    } else {
      setCreateButtonDisabled(true);
    }
  }, [winners, prizes]);

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
        <LabeledInput
          label="Winners"
          placeholder="0"
          value={winners > 0 ? winners.toString() : undefined}
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
            setDuration(value);
          }}
          className="w-full"
        />

        <List
          groupName="prize tiers"
          items={prizes.map((prize, index) => ({
            id: index.toString(),
            title: prize.name,
            description: "Tap to Configure the Tier",
          }))}
          onItemClick={({ id }) => {
            navigate(`/giveaway/setup/prize/${id}`);
          }}
          addButton={
            <AddButton
              onClick={() => {
                addEmptyPrize();
              }}
            >
              Add Tier
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
