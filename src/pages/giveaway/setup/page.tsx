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
  Button,
  PageLayout,
  TelegramMainButton,
  Text,
  useToast,
} from "@/components/kit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IListItem } from "@/interfaces";
import { getPrizeIcon } from "@/assets/icons/helper";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { getAvailableChannels } from "@/api/user.api";
import { addBotToChannelLink } from "@/utils/addBotToChannelLink";

export default function GiveawaySetUpPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [addButtonPressed, setAddButtonPressed] = useState(false);

  const {
    title,
    setTitle,

    duration,
    setDuration,

    winners_count,
    setWinners,

    prizes,
    requirements,
    removeRequirement,

    sponsors,
    removeSponsor,
    addSponsor,

    reset,
  } = useGiveawayStore((state) => state);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const createGiveawayFetch = useMutation({
    mutationFn: async (data: IGiveawayCreateRequest) =>
      await giveawayApi.createGiveaway(data),
    onSuccess: (data) => {
      navigate(`/giveaway/${data.id}`);
      reset();
    },
    onError: () => {
      showToast({
        message: "Can't create giveaway (",
        type: "error",
        time: 2000,
      });
    },
  });

  const { data: availableChannelsData } = useQuery({
    queryKey: ["available-channels"],
    queryFn: getAvailableChannels,
    refetchInterval: addButtonPressed ? 5000 : false,
  });

  const handleClick = () => {
    if (createGiveawayFetch.isPending) return;
    if (createButtonDisabled) {
      showToast({
        message: "Fill all fields",
        type: "error",
        time: 2000,
      });
      return;
    }

    createGiveawayFetch.mutate({
      title,
      winners_count,
      duration: duration * 60,
      prizes: prizes.map((prize, index) => {
        // Extract new shape from stored fields
        const titleField =
          prize.fields.find((f: any) => f.name === "title")?.value || "";
        const descriptionField =
          prize.fields.find((f: any) => f.name === "description")?.value || "";
        const quantityField =
          prize.fields.find((f: any) => f.name === "quantity")?.value || "";
        const quantityNum =
          quantityField !== "" ? Number(quantityField) : undefined;
        return {
          place: index + 1, // optional; can be omitted if backend ignores
          title: titleField,
          description: descriptionField || undefined,
          quantity:
            typeof quantityNum === "number" && !Number.isNaN(quantityNum)
              ? quantityNum
              : undefined,
        };
      }),
      requirements,
      sponsors: sponsors.map((sponsor) => ({
        id: sponsor.id,
      })),
    });
  };

  useEffect(() => {
    if (
      winners_count > 0 &&
      prizes.length > 0 &&
      title.length > 0 &&
      sponsors.length > 0
    ) {
      setCreateButtonDisabled(false);
    } else {
      setCreateButtonDisabled(true);
    }
  }, [winners_count, prizes, title, sponsors]);

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
        loading={createGiveawayFetch.isPending}
      />

      <PageLayout>
        <Block margin="top" marginValue={28}>
          <Text type="title" align="center" weight="bold">
            Set Up Giveaway
          </Text>
        </Block>

        <Block margin="top" marginValue={44} gap={24}>
          <Input
            placeholder="Name"
            value={title}
            onChange={setTitle}
            className="w-full"
            maxLength={100}
          />

          <LabeledInput
            label="Winners"
            placeholder="0"
            inputMode="numeric"
            value={
              winners_count > 0
                ? winners_count.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : 0
            }
            onChange={(value) => {
              const number = parseInt(value.replace(",", "")) || 0;
              if (number > 999999 || number < 1) return;

              setWinners(number);
            }}
            additionalLabel="users"
          />

          <Select
            label="Duration"
            options={[
              { label: "5 minutes", value: 5 },
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
          <List
            header="creators"
            footer="The channel or chat you’re adding must be public"
            addButton={
              <AddButton
                onClick={() => {
                  addBotToChannelLink();
                  setAddButtonPressed(true);
                }}
              >
                Add Creator
              </AddButton>
            }
            items={availableChannelsData?.map((channel, index) => ({
              id: index.toString(),
              logo: (
                <ChannelAvatar
                  title={channel.title}
                  avatar_url={channel.avatar_url}
                />
              ),
              title: channel.title || channel.username,
              rightIcon: sponsors.some((sponsor) => sponsor.id === channel.id)
                ? "selected"
                : "unselected",
              onClick: () => {
                if (sponsors.some((sponsor) => sponsor.id === channel.id)) {
                  removeSponsor(
                    sponsors.findIndex((sponsor) => sponsor.id === channel.id),
                  );
                } else {
                  addSponsor({
                    id: channel.id,
                    title: channel.title || channel.username,
                    avatar_url: channel.avatar_url,
                  });
                }
              },
            }))}
          />

          <List
            header="prizes"
            className="grid grid-cols-2 gap-2.5"
            addButton={
              <AddButton
                onClick={() => {
                  navigate("/giveaway/setup/prize");
                }}
              >
                Add Prize
              </AddButton>
            }
          >
            {prizes.map((prize, index) => (
              <ListItem
                id={index.toString()}
                logo={getPrizeIcon(prize.prize_type)}
                title={
                  prize.prize_type.charAt(0).toUpperCase() +
                  prize.prize_type.slice(1)
                }
                description={`${prize.fields.length} inputs`}
                onClick={() => {
                  navigate(`/giveaway/setup/prize/${index}`);
                }}
                className="rounded-[10px] after:h-0 [&_img]:scale-75"
                rightIcon={undefined}
              />
            ))}
          </List>

          <List
            header="joining requirements"
            items={requirements.map(
              (requirement, index) =>
                ({
                  id: index.toString(),
                  logo: (
                    <ChannelAvatar
                      title={
                        requirement.type === "custom"
                          ? requirement.name
                          : requirement.name?.charAt(1)
                      }
                      avatar_url={requirement.avatar_url}
                    />
                  ),
                  title:
                    requirement.type === "custom"
                      ? requirement.name
                      : `Subscribe ${requirement.name}`,
                  rightIcon: "remove",
                  onActionClick: () => {
                    removeRequirement(index);
                  },
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
