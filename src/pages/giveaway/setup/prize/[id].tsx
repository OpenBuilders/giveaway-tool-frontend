import { BottomBar } from "@/components/BottomBar";
import { Layout } from "@/components/Layout";
import { CreateGiveawayButton } from "@/components/ui/buttons/CreateGiveawayButton";
import { Input, LabeledInput } from "@/components/ui/inputs/Input";
import { List } from "@/components/ui/list/List";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function PrizePage() {
  const { id } = useParams();

  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);

  const { prizes, updatePrize } = useGiveawayStore((state) => state);
  const prizeIndex = parseInt(id ?? "0");
  const prize = prizes[prizeIndex];
  const initPrize = { ...prize };

  const navigate = useNavigate();

  useEffect(() => {
    if (
      prize.name.length > 0 &&
      prize.places.from > 0 &&
      prize.places.to > 0 &&
      prize.places.from <= prize.places.to
    ) {
      setCreateButtonDisabled(false);
    } else {
      setCreateButtonDisabled(true);
    }
  }, [prize]);

  return (
    <>
      <BackButton
        onClick={() => {
          navigate(-1);
          setCreateButtonDisabled(true);
          updatePrize(prizeIndex, initPrize);
        }}
      />

      <Layout
        title={
          <>
            Prize Tier <br /> Configuration
          </>
        }
        titleSpace
      >
        <List groupName="name">
          <Input
            label="Prize Name"
            placeholder="Prize Name"
            value={prize.name}
            onChange={(e) => {
              updatePrize(prizeIndex, {
                ...prize,
                name: e.target.value,
              });
            }}
            type="text"
          />
        </List>

        <List groupName="name">
          <LabeledInput
            label="From"
            placeholder="1"
            containerClassName="rounded-none border-giveaway"
            value={
              prize.places.from > 0 ? prize.places.from.toString() : undefined
            }
            onChange={(e) => {
              updatePrize(prizeIndex, {
                ...prize,
                places: {
                  ...prize.places,
                  from: parseInt(e.target.value.replace(",", "")) || 0,
                },
              });
            }}
            type="text"
          />
          <LabeledInput
            label="To"
            placeholder="3"
            containerClassName="rounded-none border-giveaway"
            value={prize.places.to > 0 ? prize.places.to.toString() : undefined}
            onChange={(e) => {
              updatePrize(prizeIndex, {
                ...prize,
                places: {
                  ...prize.places,
                  to: parseInt(e.target.value.replace(",", "")) || 0,
                },
              });
            }}
            type="text"
          />
        </List>
      </Layout>

      <div className="flex flex-col">
        <BottomBar>
          <CreateGiveawayButton disabled={createButtonDisabled} />
        </BottomBar>
      </div>
    </>
  );
}
