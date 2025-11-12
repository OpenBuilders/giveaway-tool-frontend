import { AddButton } from "@/components/ui/buttons/AddButton";
import { LabeledInput, Input } from "@/components/ui/inputs/Input";
import { Select } from "@/components/ui/inputs/SelectInput";
import { List } from "@/components/ui/list/List";
import { ListItem } from "@/components/ui/list/ListItem";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type {
  IGiveawayCreateRequest,
  GiveawayPrizeTemplateType,
} from "@/interfaces/giveaway.interface";
import { giveawayApi } from "@/api";
import {
  Block,
  PageLayout,
  TelegramMainButton,
  Text,
  useToast,
} from "@/components/kit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IListItem } from "@/interfaces";
import {
  getPrizeIcon,
  getRequirementIcon,
  getRequirementTitle,
} from "@/assets/icons/helper";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { getAvailableChannels } from "@/api/user.api";
import { addBotToChannelLink } from "@/utils/addBotToChannelLink";
import { MAX_GIVEAWAY_TITLE_LENGTH } from "@/utils";
import { AxiosError } from "axios";

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
    onError: (
      error: AxiosError & { response: { data: { error: string } } },
    ) => {
      showToast({
        message: error.response?.data?.error || "Can't create giveaway",
        type: "error",
        time: 2000,
      });
    },
  });

  const { data: availableChannelsData } = useQuery({
    queryKey: ["available-channels"],
    queryFn: getAvailableChannels,
    refetchInterval: addButtonPressed ? 2000 : false,
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
        // Extract new shape from stored fields (kept in store for UI)
        type PrizeField = { name?: string; value?: string } & Record<
          string,
          string
        >;
        const fields = prize.fields as PrizeField[];

        const titleField =
          fields.find((f) => (f.name ?? "") === "title")?.value || "";
        const descriptionField =
          fields.find((f) => (f.name ?? "") === "description")?.value || "";
        const quantityField =
          fields.find((f) => (f.name ?? "") === "quantity")?.value || "";
        const quantityNum =
          quantityField !== "" ? Number(quantityField) : undefined;
        return {
          place: index + 1,
          title: titleField,
          description: descriptionField || undefined,
          quantity:
            typeof quantityNum === "number" && !Number.isNaN(quantityNum)
              ? quantityNum
              : undefined,
        };
      }),
      requirements: requirements.map((req) => {
        if (req.type === "subscription" || req.type === "boost") {
          return {
            type: req.type,
            channel_id: req.channel?.id,
            channel_username: req.channel?.username,
          };
        }

        if (req.type === "holdton") {
          const amountTon = typeof req.amount === "number" ? req.amount : 0;
          const tonMinBalanceNano = Math.round(amountTon * 1e9);
          return {
            ...req,
            ton_min_balance_nano: tonMinBalanceNano,
          };
        }

        if (req.type === "holdjetton") {
          return {
            ...req,
            jetton_address: req.address,
            jetton_min_amount: req.amount,
          };
        }

        return req;
      }),
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
            maxLength={MAX_GIVEAWAY_TITLE_LENGTH}
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
                : undefined
            }
            onChange={(value) => {
              const number = parseInt(value.replace(",", "")) || 0;
              if (number > 999999 || number < 1) setWinners(NaN);

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
            items={
              Array.isArray(availableChannelsData)
                ? availableChannelsData.map((channel, index) => ({
                    id: index.toString(),
                    logo: (
                      <ChannelAvatar
                        title={channel.title}
                        avatar_url={channel.avatar_url}
                      />
                    ),
                    title: (channel.title || channel.username) as string,
                    rightIcon: sponsors.some(
                      (sponsor) => sponsor.id === channel.id,
                    )
                      ? "selected"
                      : "unselected",
                    onClick: () => {
                      if (
                        sponsors.some((sponsor) => sponsor.id === channel.id)
                      ) {
                        removeSponsor(
                          sponsors.findIndex(
                            (sponsor) => sponsor.id === channel.id,
                          ),
                        );
                      } else {
                        addSponsor({
                          id: channel.id || 0,
                          title: (channel.title || channel.username) as string,
                          avatar_url: channel.avatar_url,
                        });
                      }
                    },
                  }))
                : []
            }
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
            {prizes.map((prize, index) => {
              type PrizeField = { name?: string; value?: string } & Record<
                string,
                string
              >;
              const typeValue = (prize as Partial<typeof prize>)?.prize_type as
                | string
                | undefined;

              const fields = prize.fields as PrizeField[];
              const titleValue = (
                fields.find((f) => (f.name ?? "") === "title")?.value || ""
              ).trim();

              const safeTitle =
                typeof typeValue === "string" && typeValue.length > 0
                  ? typeValue.charAt(0).toUpperCase() + typeValue.slice(1)
                  : titleValue || "Prize";

              const inputsCount = Array.isArray(prize.fields)
                ? prize.fields.length
                : 0;

              return (
                <ListItem
                  id={index.toString()}
                  logo={getPrizeIcon(
                    (typeValue as GiveawayPrizeTemplateType) || "custom",
                  )}
                  title={safeTitle}
                  description={`${inputsCount} inputs`}
                  onClick={() => {
                    navigate(`/giveaway/setup/prize/${index}`);
                  }}
                  className="rounded-[10px] after:h-0 [&_img]:scale-75"
                  rightIcon={undefined}
                />
              );
            })}
          </List>

          <List
            header="joining requirements"
            items={requirements.map(
              (requirement, index) =>
                ({
                  id: index.toString(),
                  logo: getRequirementIcon(requirement),
                  title: getRequirementTitle(requirement),
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
