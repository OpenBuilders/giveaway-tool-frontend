import { List } from "@/components/ui/list/List";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  checkChannel,
  getGiveawayRequirementsTemplates,
} from "@/api/utils.api";
import { ListItem } from "@/components/ui/list/ListItem";
import { Select } from "@/components/ui/inputs/SelectInput";
import { useGiveawayStore } from "@/store/giveaway.slice";
import type {
  IAvailableChannelsResponse,
  IGiveawayCheckChannelResponse,
  IGiveawayRequirement,
} from "@/interfaces/giveaway.interface";
import type { AxiosError } from "axios";
import {
  PageLayout,
  TelegramMainButton,
  Block,
  Text,
  useToast,
} from "@/components/kit";
import { getAvailableChannels } from "@/api/user.api";
import { AddButton } from "@/components/ui/buttons/AddButton";
import { goTo } from "@/utils";
import { IListItem } from "@/interfaces";

export default function RequirementPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [addButtonPressed, setAddButtonPressed] = useState(false);
  const [selectedRequirementType, setSelectedRequirementType] = useState<
    string | null
  >(null);
  const [subscriptionData, setSubscriptionData] = useState<
    IAvailableChannelsResponse["channels"]
  >([]);
  const [availableChannels, setAvailableChannels] = useState<
    IAvailableChannelsResponse["channels"]
  >([]);
  const { addRequirement } = useGiveawayStore();

  const navigate = useNavigate();
  const { showToast } = useToast();

  const addBotLink = `https://t.me/${
    import.meta.env.VITE_BOT_USERNAME
  }?startgroup=&admin=restrict_members+invite_users`;

  const { data: requirementTemplates } = useQuery({
    queryKey: ["requirement-templates"],
    queryFn: getGiveawayRequirementsTemplates,
  });

  const { data: availableChannelsData } = useQuery({
    queryKey: ["available-channels"],
    queryFn: getAvailableChannels,
    enabled: selectedRequirementType === "subscription",
    select: (data) => data.channels,
    refetchInterval: addButtonPressed ? 5000 : false,
  });

  const checkBotExistInChannelsFetch = useMutation({
    mutationFn: (usernames: string[]) => checkChannel(usernames),
    onSuccess: (data: IGiveawayCheckChannelResponse) => {
      if (
        data.results.every(
          (result) =>
            !result.error && result.ok && result.bot_status.can_check_members,
        )
      ) {
        const requirementData: IGiveawayRequirement[] = subscriptionData.map(
          (channel) => ({
            type: selectedRequirementType as IGiveawayRequirement["type"],
            username: channel.username,
            avatar_url: channel.avatar_url,
          }),
        );

        for (const requirement of requirementData) {
          addRequirement(requirement);
        }
        navigate("/giveaway/setup");
      } else {
        const firstError = data.results.find((result) => result.error);
        showToast({
          message: firstError?.error || "Bot can't check members",
          type: "error",
          time: 2000,
        });
      }
    },
    onError: (data: AxiosError & { response: { data: { error: string } } }) => {
      showToast({
        message: data.response?.data?.error,
        type: "error",
        time: 4000,
      });
      setCreateButtonDisabled(true);
    },
  });

  useEffect(() => {
    if (selectedRequirementType && subscriptionData?.length === 0) {
      setCreateButtonDisabled(true);
    } else {
      setCreateButtonDisabled(false);
    }
  }, [subscriptionData, selectedRequirementType]);

  useEffect(() => {
    const filteredChannels = availableChannelsData?.filter(
      (channel) => !subscriptionData.some((sub) => sub.id === channel.id),
    );
    setAvailableChannels(filteredChannels || []);
  }, [availableChannelsData, subscriptionData]);

  return (
    <>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      {selectedRequirementType && (
        <TelegramMainButton
          text="Add Requirement"
          onClick={() => {
            checkBotExistInChannelsFetch.mutate(
              subscriptionData.map((sub) => sub.username || "@testadsd"),
            );
          }}
          disabled={
            createButtonDisabled || checkBotExistInChannelsFetch.isPending
          }
          loading={checkBotExistInChannelsFetch.isPending}
        />
      )}

      <PageLayout>
        <Block margin="top" marginValue={44}>
          <Text type="title" align="center" weight="bold">
            Add Requirement
          </Text>
        </Block>

        <Block margin="top" marginValue={44}>
          {selectedRequirementType ? (
            <Block gap={24}>
              <List>
                <Select
                  label="Type"
                  type="withIcon"
                  options={
                    requirementTemplates?.map((template) => ({
                      value: template.type,
                      label: template.name,
                    })) || []
                  }
                  selectedValue={String(selectedRequirementType)}
                  onChange={(value) => {
                    setSelectedRequirementType(String(value));
                    setSubscriptionData([]);
                  }}
                />
              </List>

              {selectedRequirementType === "subscription" && (
                <>
                  <List
                    header="available channels"
                    items={
                      availableChannels.map((item, index) => ({
                        id: index.toString(),
                        title: item.title,
                        logo: item.avatar_url,
                        rightIcon: "arrow",
                        onClick: () => {
                          setSubscriptionData((prev) => [...prev, item]);
                        },
                      })) as IListItem[]
                    }
                  />

                  <List
                    header="channels"
                    footer="The channel or chat you’re adding must be public"
                    items={subscriptionData.map(
                      (item, index) =>
                        ({
                          id: index.toString(),
                          title: item.title,
                          logo: item.avatar_url,
                          rightIcon: "remove",
                          onActionClick: () => {
                            setSubscriptionData((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          },
                        }) as IListItem,
                    )}
                    addButton={
                      <AddButton
                        onClick={() => {
                          goTo(addBotLink);
                          setAddButtonPressed(true);
                        }}
                      >
                        Add Channel
                      </AddButton>
                    }
                  />
                </>
              )}
            </Block>
          ) : (
            <List>
              {requirementTemplates?.map((template, index) => (
                <ListItem
                  key={template.id}
                  id={template.id}
                  title={template.name}
                  onClick={() => {
                    setSelectedRequirementType(template.type);
                  }}
                  separator={requirementTemplates?.length !== index + 1}
                  rightIcon="arrow"
                />
              ))}
            </List>
          )}
        </Block>
      </PageLayout>
    </>
  );
}
