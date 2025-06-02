import { LabeledInput } from "@/components/ui/inputs/Input";
import { List } from "@/components/ui/list/List";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  checkChannel,
  getGiveawayRequirementsTemplates,
} from "@/api/giveaway.api";
import { ListItem } from "@/components/ui/list/ListItem";
import { Select } from "@/components/ui/inputs/SelectInput";
import { useGiveawayStore } from "@/store/giveaway.slice";
import type {
  IGiveawayCheckChannelResponse,
  IGiveawayRequirement,
} from "@/interfaces/giveaway.interface";
import type { AxiosError } from "axios";
import {
  ListInputProps,
  PageLayout,
  TelegramMainButton,
  Block,
  Text,
  useToast,
} from "@/components/kit";

export default function RequirementPage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [selectedRequirementType, setSelectedRequirementType] = useState<
    string | null
  >(null);
  const [fieldsData, setFieldsData] = useState<
    {
      type: string;
      label: string;
      placeholder: string;
      value: string;
    }[]
  >([]);
  const { addRequirement } = useGiveawayStore();

  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: requirementTemplates } = useQuery({
    queryKey: ["requirement-templates"],
    queryFn: getGiveawayRequirementsTemplates,
  });

  const checkBotExistInChannelFetch = useMutation({
    mutationFn: (username: string) => checkChannel(username),
    onSuccess: (data: IGiveawayCheckChannelResponse) => {
      if (data.bot_status.can_check_members) {
        const requirementData: IGiveawayRequirement = {
          type: selectedRequirementType as IGiveawayRequirement["type"],
          name: data.channel.title,
          value: `@${data.channel.username}`,
        };

        addRequirement(requirementData);
        navigate("/giveaway/setup");
      } else {
        showToast({
          message: "Bot can't check members",
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

  const fieldBase = useMemo(
    () => ({
      subscription: [
        {
          type: "text",
          label: "Channel username",
          placeholder: "@channel_name",
          value: "",
        },
      ],
    }),
    []
  );

  useEffect(() => {
    if (
      selectedRequirementType &&
      fieldsData.some((field) => field.value === "")
    ) {
      setCreateButtonDisabled(true);
    } else {
      setCreateButtonDisabled(false);
    }
  }, [fieldsData, selectedRequirementType]);

  return (
    <>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />

      <PageLayout>
        <Block margin="top" marginValue={44}>
          <Text type="title" align="center" weight="bold">
            Add Prize
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
                    setFieldsData([]);
                  }}
                />
              </List>

              <List>
                {fieldBase[
                  selectedRequirementType as keyof typeof fieldBase
                ].map((field) => (
                  <LabeledInput
                    key={field.label}
                    containerClassName="rounded-none border-b-[1px] border-[#E5E7EB] last:border-b-0"
                    label={field.label}
                    placeholder={field.placeholder}
                    additionalLabel=""
                    value={
                      fieldsData.find((f) => f.label === field.label)?.value
                    }
                    onChange={(value) => {
                      setFieldsData((prev) => {
                        const existingField = prev.find(
                          (f) => f.label === field.label
                        );
                        if (existingField) {
                          return prev.map((f) => {
                            if (f.label === field.label) {
                              return {
                                ...f,
                                value,
                              };
                            }
                            return f;
                          });
                        }
                        return [...prev, { ...field, value }];
                      });
                    }}
                    type={field.type as ListInputProps["type"]}
                  />
                ))}
              </List>
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
                />
              ))}
            </List>
          )}
        </Block>
      </PageLayout>

      <TelegramMainButton
        text="Add Requirement"
        onClick={() => {
          checkBotExistInChannelFetch.mutate(fieldsData[0].value);
        }}
        disabled={createButtonDisabled || checkBotExistInChannelFetch.isPending}
      />
    </>
  );
}
