import { AddButton } from "@/components/ui/buttons/AddButton";
import { LabeledInput, Input } from "@/components/ui/inputs/Input";
import { Select } from "@/components/ui/inputs/SelectInput";
import { List } from "@/components/ui/list/List";
import { ListItem } from "@/components/ui/list/ListItem";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { IGiveawayCreateRequest } from "@/interfaces/giveaway.interface";
import { giveawayApi } from "@/api";
import {
  Block,
  PageLayout,
  TelegramMainButton,
  Text,
  useToast,
} from "@/components/kit";
import { useMutation } from "@tanstack/react-query";
import { IListItem } from "@/interfaces";

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
  const { showToast } = useToast();

  const createGiveawayFetch = useMutation({
    mutationFn: async (data: IGiveawayCreateRequest) =>
      await giveawayApi.createGiveaway(data),
    onSuccess: (data) => {
      navigate(`/giveaway/${data.id}`);
    },
    onError: () => {
      showToast({
        message: "Can't create giveaway (",
        type: "error",
        time: 2000,
      });
    },
  });

  const handleClick = () => {
    createGiveawayFetch.mutate({
      title,
      winners_count,
      duration: duration * 60,
      description: "Giveaway Description",
      prizes: prizes.map((prize) => ({
        place: "all",
        ...prize,
      })),
      requirements,
    });
  };

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
          navigate("/");
          setCreateButtonDisabled(true);
          reset();
        }}
      />
      <TelegramMainButton
        text="Create Giveaway"
        onClick={handleClick}
        disabled={createButtonDisabled}
      />

      <PageLayout>
        <Block margin="top" marginValue={44}>
          <Text type="title" align="center" weight="bold">
            Set Up Giveaway
          </Text>
        </Block>

        <Block margin="top" marginValue={44} gap={24}>
          <Input placeholder="Name" value={title} onChange={setTitle} />

          <LabeledInput
            label="Winners"
            placeholder="0"
            inputMode="numeric"
            value={winners_count > 0 ? winners_count.toString() : undefined}
            onChange={(value) => {
              setWinners(parseInt(value.replace(",", "")) || 0);
            }}
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
        </Block>

        <Block margin="top" marginValue={24} gap={24}>
          <div
            className={`flex flex-col ${prizes.length > 0 ? "gap-2.5" : ""}`}
          >
            <List header="prizes" className="grid grid-cols-2 gap-2.5">
              {prizes.map((prize, index) => (
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
                  isArrow={false}
                />
              ))}
            </List>

            <div className="bg-section-bg border-giveaway flex max-h-[44px] w-full items-center justify-between rounded-[10px] px-4 py-2">
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
            header="joining requirements"
            items={requirements.map(
              (requirement, index) =>
                ({
                  id: index.toString(),
                  logo:
                    requirement.type === "subscription"
                      ? "/gift.svg"
                      : undefined,
                  title: requirement.name,
                  description: requirement.value,
                  className: "[&_img]:scale-75",
                }) as IListItem,
            )}
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
        </Block>
      </PageLayout>
    </>
  );
}
