import { BottomBar } from "@/components/BottomBar";
import { Layout } from "@/components/Layout";
import { CreateGiveawayButton } from "@/components/ui/buttons/CreateGiveawayButton";
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
          value: data.channel.username,
        };

        addRequirement(requirementData);
        navigate("/giveaway/setup");
      } else {
        alert("Bot can't check members");
      }
    },
    onError: (data: AxiosError & { response: { data: { error: string } } }) => {
      alert(data.response?.data?.error);
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

    console.log(fieldsData);
  }, [fieldsData, selectedRequirementType]);

  return (
    <>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />

      <Layout title={<>Add Requirement</>} titleSpace>
        {selectedRequirementType ? (
          <div className="flex flex-col gap-6">
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
              {fieldBase[selectedRequirementType as keyof typeof fieldBase].map(
                (field) => (
                  <LabeledInput
                    key={field.label}
                    containerClassName="rounded-none border-b-[1px] border-[#E5E7EB] last:border-b-0"
                    label={field.label}
                    placeholder={field.placeholder}
                    additionalLabel=""
                    value={
                      fieldsData.find((f) => f.label === field.label)?.value
                    }
                    onChange={(e) => {
                      setFieldsData((prev) => {
                        const existingField = prev.find(
                          (f) => f.label === field.label
                        );
                        if (existingField) {
                          return prev.map((f) => {
                            if (f.label === field.label) {
                              return {
                                ...f,
                                value: e.target.value,
                              };
                            }
                            return f;
                          });
                        }
                        return [...prev, { ...field, value: e.target.value }];
                      });
                    }}
                    type={field.type}
                  />
                )
              )}
            </List>
          </div>
        ) : (
          <List>
            {requirementTemplates?.map((template) => (
              <ListItem
                key={template.id}
                id={template.id}
                title={template.name}
                onClick={() => {
                  setSelectedRequirementType(template.type);
                }}
              />
            ))}
          </List>
        )}
      </Layout>

      {selectedRequirementType && (
        <div className="flex flex-col">
          <BottomBar>
            <CreateGiveawayButton
              disabled={createButtonDisabled || checkBotExistInChannelFetch.isPending}
              onClick={() => {
                checkBotExistInChannelFetch.mutate(fieldsData[0].value);
              }}
            >
              Add Requirement
            </CreateGiveawayButton>
          </BottomBar>
        </div>
      )}
    </>
  );
}
