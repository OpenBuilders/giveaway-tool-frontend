import { List } from "@/components/ui/list/List";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  checkChannel,
  getGiveawayRequirementsTemplates,
  getJettonMetadata,
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
  ListToggler,
} from "@/components/kit";
import { getAvailableChannels } from "@/api/user.api";
import { AddButton } from "@/components/ui/buttons/AddButton";
import { IListItem } from "@/interfaces";
import { getRequirementIcon } from "@/assets/icons/helper";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { LabeledInput } from "@/components/ui/inputs/Input";
import { SearchInput } from "@/components/ui/inputs/SearchInput";
import { addBotToChannelLink } from "@/utils/addBotToChannelLink";
import { JETTON_TEMPLATES } from "@/utils/jettonTemplates";
// import { collapseAddress } from "@/utils/collapseAddress";

export default function RequirementPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [addButtonPressed, setAddButtonPressed] = useState(false);
  const [channelsSnapshot, setChannelsSnapshot] = useState<number[] | null>(
    null,
  );
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
  const [isPremiumEnabled, setIsPremiumEnabled] = useState(false);
  const [subscriptionData, setSubscriptionData] =
    useState<IAvailableChannelsResponse>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");

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

  useEffect(() => {
    if (!addButtonPressed) return;
    if (!Array.isArray(availableChannelsData)) return;
    if (
      !(
        selectedRequirementType === "subscription" ||
        selectedRequirementType === "boost"
      )
    ) {
      return;
    }

    // Initialize snapshot on the first fetch after pressing Add
    if (channelsSnapshot === null) {
      const ids = availableChannelsData
        .map((c) => c.id)
        .filter((id): id is number => typeof id === "number");
      setChannelsSnapshot(ids);
      return;
    }

    // Compare current list with snapshot to find newly appeared channels
    const snapshotSet = new Set(channelsSnapshot);
    const newChannels =
      availableChannelsData.filter(
        (c) => typeof c.id === "number" && !snapshotSet.has(c.id as number),
      ) || [];

    if (newChannels.length > 0) {
      const picked = newChannels[newChannels.length - 1];
      if (picked && typeof picked.id === "number") {
        const alreadyInSelection = subscriptionData.some(
          (s) => s.id === picked.id,
        );
        if (!alreadyInSelection) {
          setSubscriptionData((prev) => [...prev, picked]);
        }
      }
      // Stop polling and clear snapshot
      setAddButtonPressed(false);
      setChannelsSnapshot(null);
    }
  }, [availableChannelsData, addButtonPressed, selectedRequirementType]); // eslint-disable-line react-hooks/exhaustive-deps

  const addHoldJettonWithMetadata = useMutation({
    mutationFn: ({ address }: { address: string; amount: number }) =>
      getJettonMetadata(address),
    onSuccess: (meta, variables) => {
      const { address, amount } = variables as {
        address: string;
        amount: number;
      };
      addRequirement({
        type: "holdjetton",
        address,
        amount,
        jetton_symbol: meta.symbol,
        jetton_image: meta.image,
      });
      navigate("/giveaway/setup");
    },
    onError: () => {
      showToast({ message: "Token is invalid", type: "error", time: 2000 });
    },
  });

  const checkBotExistInChannelsFetch = useMutation({
    mutationFn: (channel_ids: string[]) => checkChannel(channel_ids),
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
            name: channel.title,
            username: channel.username,
            avatar_url: channel.avatar_url,
            channel: {
              id: channel.id,
              title: channel.title as string,
              username: channel.username,
              avatar_url: channel.avatar_url as string,
              url: channel.url,
            },
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
        setCreateButtonDisabled(!(customData.title.trim().length > 0));
      } else if (selectedRequirementType === "premium") {
        setCreateButtonDisabled(!isPremiumEnabled);
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
    isPremiumEnabled,
  ]);

  return (
    <>
      <BackButton
        onClick={() => {
          if (selectedRequirementType) {
            setSelectedRequirementType(null);
            setSubscriptionData([]);
            setHoldTonAmount("");
            setHoldJetton({ address: "", amount: "" });
            setIsPremiumEnabled(false);
          } else {
            navigate(-1);
          }
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
                subscriptionData.map((sub) => sub.id?.toString() || ""),
              );

              return;
            } else if (selectedRequirementType === "custom") {
              if (customData.title.trim().length > 0) {
                addRequirement({
                  type: selectedRequirementType,
                  name: customData.title,
                  description: customData.description,
                });
              } else {
                showToast({
                  message: "Title is required",
                  type: "error",
                  time: 2000,
                });
                return;
              }
            } else if (selectedRequirementType === "premium") {
              if (isPremiumEnabled) {
                addRequirement({
                  type: "premium",
                });
              } else {
                showToast({
                  message: "Enable the toggle to add Premium requirement",
                  type: "error",
                  time: 2000,
                });
                return;
              }
            } else if (selectedRequirementType === "holdton") {
              const amount = Number(holdTonAmount.replace(/,/g, ""));
              if (amount > 0) {
                addRequirement({
                  type: "holdton",
                  amount,
                });
              } else {
                showToast({
                  message: "Amount is invalid",
                  type: "error",
                  time: 2000,
                });
              }
            } else if (selectedRequirementType === "holdjetton") {
              const amount = Number(holdJetton.amount.replace(/,/g, ""));
              const address = holdJetton.address.trim();
              if (address && amount > 0) {
                const tpl = JETTON_TEMPLATES.find((t) => t.address === address);
                if (tpl) {
                  addRequirement({
                    type: "holdjetton",
                    address,
                    amount,
                    jetton_symbol: tpl.symbol,
                    jetton_image: tpl.image,
                  });
                  navigate("/giveaway/setup");
                } else {
                  addHoldJettonWithMetadata.mutate({ address, amount });
                  return; // navigate happens in onSuccess
                }
              } else {
                showToast({
                  message: "All fields are required",
                  type: "error",
                  time: 2000,
                });
              }
            }

            navigate("/giveaway/setup");
          }}
          disabled={
            createButtonDisabled ||
            checkBotExistInChannelsFetch.isPending ||
            addHoldJettonWithMetadata.isPending
          }
          loading={
            checkBotExistInChannelsFetch.isPending ||
            addHoldJettonWithMetadata.isPending
          }
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

              {(selectedRequirementType === "subscription" ||
                selectedRequirementType === "boost") && (
                <>
                  <List
                    header="add from your channels"
                    footer="The channel or chat you’re adding must be public"
                    items={(Array.isArray(availableChannelsData)
                      ? availableChannelsData
                      : []
                    )?.map(
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
                          if (Array.isArray(availableChannelsData)) {
                            const ids = availableChannelsData
                              .map((c) => c.id)
                              .filter(
                                (id): id is number => typeof id === "number",
                              );
                            setChannelsSnapshot(ids);
                          } else {
                            setChannelsSnapshot(null);
                          }
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
                        onSearch={async (value) => {
                          const current = (value ?? searchQuery).trim();
                          if (!current) return;
                          const query = current.replace(/^@/, "");
                          setAppliedSearchQuery(query);
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

                    {appliedSearchQuery.trim().length > 0 && (
                      <List
                        items={(Array.isArray(availableChannelsData)
                          ? availableChannelsData
                          : []
                        )
                          ?.filter(
                            (item) =>
                              (item.title || "")
                                .toLowerCase()
                                .includes(appliedSearchQuery.toLowerCase()) ||
                              (item.username || "")
                                .toLowerCase()
                                .includes(appliedSearchQuery.toLowerCase()),
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
                    )}
                  </Block>
                </>
              )}

              {selectedRequirementType === "holdton" && (
                <List>
                  <LabeledInput
                    containerClassName="rounded-none border-b-[1px] border-border-separator last:border-b-0"
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
                <Block gap={24}>
                  <List>
                    <LabeledInput
                      containerClassName="rounded-none border-b-[1px] border-border-separator last:border-b-0"
                      label="Token Contract"
                      placeholder="EQC..."
                      value={holdJetton.address}
                      onChange={(value) => {
                        setHoldJetton((prev) => ({ ...prev, address: value }));
                      }}
                    />
                    <LabeledInput
                      containerClassName="rounded-none border-b-[1px] border-border-separator last:border-b-0"
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

                  {/* Templates under the address input */}
                  {Array.isArray(JETTON_TEMPLATES) &&
                    JETTON_TEMPLATES.length > 0 && (
                      <List
                        header="or choose a template"
                        items={
                          JETTON_TEMPLATES.map((t) => ({
                            id: t.id,
                            title: t.name,
                            logo: t.image,
                            rightIcon:
                              holdJetton.address === t.address
                                ? "selected"
                                : "unselected",
                            onClick: () => {
                              setHoldJetton((prev) => ({
                                ...prev,
                                address: t.address,
                              }));
                            },
                          })) as IListItem[]
                        }
                      ></List>
                    )}
                </Block>
              )}

              {selectedRequirementType === "premium" && (
                <List
                  footer="We check for Telegram Premium only at the moment of joining the chat or channel"
                  items={[
                    {
                      id: "premium",
                      title: "Request Telegram Premium",
                      after: (
                        <ListToggler
                          isEnabled={!!isPremiumEnabled}
                          onChange={(value) => setIsPremiumEnabled(value)}
                        />
                      ),
                    } as IListItem,
                  ]}
                />
              )}

              {selectedRequirementType === "custom" && (
                <List>
                  <LabeledInput
                    containerClassName="rounded-none border-b-[1px] border-border-separator last:border-b-0"
                    label="Title"
                    placeholder="Title"
                    maxLength={30}
                    value={customData.title}
                    onChange={(value) => {
                      setCustomData((prev) => ({
                        ...prev,
                        title: value,
                      }));
                    }}
                  />
                  <LabeledInput
                    containerClassName="rounded-none border-b-[1px] border-border-separator last:border-b-0"
                    label="Description"
                    placeholder="Description"
                    maxLength={300}
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
