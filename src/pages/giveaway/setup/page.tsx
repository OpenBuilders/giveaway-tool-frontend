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
import { giveawayApi, utilsApi } from "@/api";
import {
  Block,
  PageLayout,
  TelegramMainButton,
  Text,
  useToast,
} from "@/components/kit";
import { useMutation } from "@tanstack/react-query";
import { IListItem } from "@/interfaces";
import { getPrizeIcon } from "@/assets/icons/helper";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";

export default function GiveawaySetUpPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [creatorUsername, setCreatorUsername] = useState("");
  const [viewCreatorInput, setViewCreatorInput] = useState(false);

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

  const checkChannelFetch = useMutation({
    mutationFn: async (username: string) =>
      await utilsApi.getChannelInfo(username),
    onSuccess: (data) => {
      addSponsor({
        id: data.id,
        title: data.title || "",
        avatar_url: data.avatar_url,
      });
      setCreatorUsername("");
      setViewCreatorInput(false);
    },
    onError: () => {
      showToast({
        message: "Channel not found",
        type: "error",
        time: 2000,
      });
    },
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
      prizes: prizes.map((prize) => ({
        place: "all",
        ...prize,
      })),
      requirements,
      sponsors: sponsors.map((sponsor) => ({
        id: sponsor.id,
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
        <Block margin="top" marginValue={44}>
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
          />

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
              sponsors.length < 3 && (
                <AddButton
                  onClick={() => {
                    setViewCreatorInput(true);
                  }}
                >
                  Add Creator
                </AddButton>
              )
            }
            beforeList={
              sponsors.length < 3 &&
              viewCreatorInput && (
                <Input
                  placeholder="@channel"
                  value={creatorUsername}
                  onChange={setCreatorUsername}
                  onBlur={() => {
                    if (creatorUsername.length === 0) return;
                    if (
                      sponsors.some(
                        (sponsor) => sponsor.username === creatorUsername,
                      )
                    ) {
                      showToast({
                        message: "Creator already added",
                        type: "error",
                        time: 2000,
                      });
                      return;
                    }

                    checkChannelFetch.mutate(creatorUsername);
                  }}
                />
              )
            }
            items={sponsors.map((sponsor, index) => ({
              id: index.toString(),
              logo: (
                <ChannelAvatar
                  title={sponsor.title}
                  avatar_url={sponsor.avatar_url}
                />
              ),
              title: sponsor.title,
              rightIcon: "remove",
              onActionClick: () => {
                removeSponsor(index);
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
                      title={requirement.username?.charAt(1)}
                      avatar_url={requirement.avatar_url}
                    />
                  ),
                  title: `Subscribe ${requirement.username}`,
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
