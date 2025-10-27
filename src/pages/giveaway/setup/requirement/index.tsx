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
import { IListItem } from "@/interfaces";
import { getRequirementIcon } from "@/assets/icons/helper";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { LabeledInput } from "@/components/ui/inputs/Input";
import { SearchInput } from "@/components/ui/inputs/SearchInput";
import { addBotToChannelLink } from "@/utils/addBotToChannelLink";

export default function RequirementPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [addButtonPressed, setAddButtonPressed] = useState(false);
  const [customData, setCustomData] = useState({
    title: "",
    description: "",
  });
  const [holdTonAmount, setHoldTonAmount] = useState<string>("");
  const [holdJetton, setHoldJetton] = useState<{
    address: string;
    amount: string;
  }>({
    address: "",
    amount: "",
  });
  const [selectedRequirementType, setSelectedRequirementType] = useState<
    string | null
  >(null);
  const [subscriptionData, setSubscriptionData] =
    useState<IAvailableChannelsResponse>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { addRequirement } = useGiveawayStore();

  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: requirementTemplates } = useQuery({
    queryKey: ["requirement-templates"],
    queryFn: getGiveawayRequirementsTemplates,
  });

  const { data: availableChannelsData } = useQuery({
    queryKey: ["available-channels"],
    queryFn: getAvailableChannels,
    enabled:
      selectedRequirementType === "subscription" ||
      selectedRequirementType === "boost",
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
    if (
      selectedRequirementType === "subscription" &&
      subscriptionData?.length === 0
    ) {
      setCreateButtonDisabled(true);
    } else {
      if (selectedRequirementType === "custom") {
        setCreateButtonDisabled(
          !(
            customData.title.trim().length > 0 &&
            customData.description.trim().length > 0
          ),
        );
      } else if (selectedRequirementType === "holdton") {
        const n = Number(holdTonAmount.replace(/,/g, ""));
        setCreateButtonDisabled(!(n > 0));
      } else if (selectedRequirementType === "holdjetton") {
        const n = Number(holdJetton.amount.replace(/,/g, ""));
        const addrOk = holdJetton.address.trim().length > 0;
        setCreateButtonDisabled(!(addrOk && n > 0));
      } else {
        setCreateButtonDisabled(false);
      }
    }
  }, [
    subscriptionData,
    selectedRequirementType,
    customData,
    holdTonAmount,
    holdJetton,
  ]);

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
            if (
              selectedRequirementType === "subscription" ||
              selectedRequirementType === "boost"
            ) {
              checkBotExistInChannelsFetch.mutate(
                subscriptionData.map((sub) => sub.username || "@testadsd"),
              );

              return;
            } else if (selectedRequirementType === "custom") {
              addRequirement({
                type: selectedRequirementType,
                name: customData.title,
                description: customData.description,
              });
            } else if (selectedRequirementType === "holdton") {
              const amount = Number(holdTonAmount.replace(/,/g, ""));
              if (amount > 0) {
                addRequirement({
                  type: "holdton",
                  amount,
                });
              }
            } else if (selectedRequirementType === "holdjetton") {
              const amount = Number(holdJetton.amount.replace(/,/g, ""));
              const address = holdJetton.address.trim();
              if (address && amount > 0) {
                addRequirement({
                  type: "holdjetton",
                  address,
                  amount,
                });
              }
            }

            navigate("/giveaway/setup");
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
                    setHoldTonAmount("");
                    setHoldJetton({ address: "", amount: "" });
                  }}
                />
              </List>

              {(selectedRequirementType === "subscription" ||
                selectedRequirementType === "boost") && (
                <>
                  <List
                    header="add from your channels"
                    footer="The channel or chat you’re adding must be public"
                    items={(Array.isArray(availableChannelsData) ? availableChannelsData : [])?.map(
                      (item, index) =>
                        ({
                          id: index.toString(),
                          title: item.title,
                          logo: (
                            <ChannelAvatar
                              title={item.title}
                              avatar_url={item.avatar_url}
                            />
                          ),
                          rightIcon: subscriptionData.some(
                            (sub) => sub.id === item.id,
                          )
                            ? "selected"
                            : "unselected",
                          onClick: () => {
                            if (
                              subscriptionData.some((sub) => sub.id === item.id)
                            ) {
                              setSubscriptionData((prev) =>
                                prev.filter((sub) => sub.id !== item.id),
                              );
                            } else {
                              setSubscriptionData((prev) => [...prev, item]);
                            }
                          },
                        }) as IListItem,
                    )}
                    addButton={
                      <AddButton
                        onClick={() => {
                          addBotToChannelLink();
                          setAddButtonPressed(true);
                        }}
                      >
                        Add Channel
                      </AddButton>
                    }
                  />

                  <Block gap={10}>
                    <List header="or find via search">
                      <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={async () => {
                          if (!searchQuery.trim()) return;
                          const query = searchQuery.trim().replace(/^@/, "");
                          console.log(query);
                          // try {
                          //   setIsSearching(true);
                          //   const res = await getChannelInfo(query);
                          //   setSearchResults(res ? [res] : []);
                          // } catch {
                          //   setSearchResults([]);
                          // } finally {
                          //   setIsSearching(false);
                          // }
                        }}
                        placeholder="Search..."
                      />
                    </List>

                    <List
                      items={(Array.isArray(availableChannelsData) ? availableChannelsData : [])
                        ?.filter((item) =>
                          searchQuery.trim().length
                            ? (item.title || "")
                                .toLowerCase()
                                .includes(searchQuery.trim().toLowerCase()) ||
                              (item.username || "")
                                .toLowerCase()
                                .includes(searchQuery.trim().toLowerCase())
                            : true,
                        )
                        .map(
                          (item, index) =>
                            ({
                              id: `search-${index}`,
                              title: item.title,
                              logo: (
                                <ChannelAvatar
                                  title={item.title}
                                  avatar_url={item.avatar_url}
                                />
                              ),
                              rightIcon: subscriptionData.some(
                                (sub) => sub.id === item.id,
                              )
                                ? "selected"
                                : "unselected",
                              onClick: () => {
                                if (
                                  subscriptionData.some(
                                    (sub) => sub.id === item.id,
                                  )
                                ) {
                                  setSubscriptionData((prev) =>
                                    prev.filter((sub) => sub.id !== item.id),
                                  );
                                } else {
                                  setSubscriptionData((prev) => [
                                    ...prev,
                                    item,
                                  ]);
                                }
                              },
                            }) as IListItem,
                        )}
                    />
                  </Block>
                </>
              )}

              {selectedRequirementType === "holdton" && (
                <List>
                  <LabeledInput
                    containerClassName="rounded-none border-b-[1px] border-[#E5E7EB] last:border-b-0"
                    label="Amount"
                    placeholder="0"
                    inputMode="decimal"
                    value={holdTonAmount}
                    onChange={(value) => {
                      setHoldTonAmount(value);
                    }}
                    additionalLabel="TON"
                  />
                </List>
              )}

              {selectedRequirementType === "holdjetton" && (
                <List>
                  <LabeledInput
                    containerClassName="rounded-none border-b-[1px] border-[#E5E7EB] last:border-b-0"
                    label="Token Contract"
                    placeholder="EQC..."
                    value={holdJetton.address}
                    onChange={(value) => {
                      setHoldJetton((prev) => ({ ...prev, address: value }));
                    }}
                  />
                  <LabeledInput
                    containerClassName="rounded-none border-b-[1px] border-[#E5E7EB] last:border-b-0"
                    label="Amount"
                    placeholder="0"
                    inputMode="decimal"
                    value={holdJetton.amount}
                    onChange={(value) => {
                      setHoldJetton((prev) => ({ ...prev, amount: value }));
                    }}
                    additionalLabel="tokens"
                  />
                </List>
              )}

              {selectedRequirementType === "custom" && (
                <List>
                  <LabeledInput
                    containerClassName="rounded-none border-b-[1px] border-[#E5E7EB] last:border-b-0"
                    label="Title"
                    placeholder="Title"
                    value={customData.title}
                    onChange={(value) => {
                      setCustomData((prev) => ({
                        ...prev,
                        title: value,
                      }));
                    }}
                  />
                  <LabeledInput
                    containerClassName="rounded-none border-b-[1px] border-[#E5E7EB] last:border-b-0"
                    label="Description"
                    placeholder="Description"
                    value={customData.description}
                    onChange={(value) => {
                      setCustomData((prev) => ({
                        ...prev,
                        description: value,
                      }));
                    }}
                  />
                </List>
              )}
            </Block>
          ) : (
            <List>
              {requirementTemplates?.map((template, index) => (
                <ListItem
                  key={template.id}
                  id={template.id}
                  title={template.name}
                  logo={getRequirementIcon(template)}
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
