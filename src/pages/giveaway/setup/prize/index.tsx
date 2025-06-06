import { LabeledInput } from "@/components/ui/inputs/Input";
import { List } from "@/components/ui/list/List";
import { useQuery } from "@tanstack/react-query";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { getGiveawayPrizeTemplates } from "@/api/giveaway.api";
import { ListItem } from "@/components/ui/list/ListItem";
import { Select } from "@/components/ui/inputs/SelectInput";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { GiveawayPrizeTemplateType } from "@/interfaces/giveaway.interface";
import {
  Block,
  Text,
  ListInputProps,
  PageLayout,
  TelegramMainButton,
} from "@/components/kit";

export default function PrizePage() {
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [selectedPrizeTemplate, setSelectedPrizeTemplate] = useState<
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
  const { addPrize } = useGiveawayStore();

  const navigate = useNavigate();

  const { data: prizeTemplatesData } = useQuery({
    queryKey: ["prize-templates"],
    queryFn: getGiveawayPrizeTemplates,
  });

  const fieldBase = useMemo(
    () => ({
      custom: [
        {
          type: "text",
          label: "Name",
          placeholder: "Name",
          value: "",
        },
        {
          type: "text",
          label: "Description",
          placeholder: "Description",
          value: "",
        },
      ],
    }),
    []
  );

  useEffect(() => {
    if (
      selectedPrizeTemplate &&
      fieldsData.some((field) => field.value === "")
    ) {
      setCreateButtonDisabled(true);
    } else {
      setCreateButtonDisabled(false);
    }
  }, [fieldsData, selectedPrizeTemplate]);

  return (
    <>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      {selectedPrizeTemplate && (
        <TelegramMainButton
          text="Add Prize"
          disabled={createButtonDisabled}
          onClick={() => {
            addPrize({
              prize_type: GiveawayPrizeTemplateType[
                Object.keys(GiveawayPrizeTemplateType).find(
                  (key) =>
                    GiveawayPrizeTemplateType[
                      key as keyof typeof GiveawayPrizeTemplateType
                    ] === selectedPrizeTemplate
                ) as keyof typeof GiveawayPrizeTemplateType
              ],
              fields: fieldsData.map((field) => ({
                type: field.type,
                name: field.label.toLowerCase(),
                value: field.value,
              })),
            });
            navigate("/giveaway/setup");
          }}
        />
      )}

      <PageLayout>
        <Block margin="top" marginValue={44}>
          <Text type="title" align="center" weight="bold">
            Add Prize
          </Text>
        </Block>
        <Block margin="top" marginValue={44}>
          {selectedPrizeTemplate ? (
            <Block gap={24}>
              <Select
                label="Type"
                type="withIcon"
                options={
                  prizeTemplatesData?.map((prizeTemplate) => ({
                    value: String(prizeTemplate.type),
                    label: prizeTemplate.name,
                  })) || []
                }
                selectedValue={String(selectedPrizeTemplate)}
                onChange={(value) => {
                  setSelectedPrizeTemplate(String(value));
                }}
              />

              <List>
                {fieldBase[selectedPrizeTemplate as keyof typeof fieldBase].map(
                  (field) => (
                    <LabeledInput
                      key={field.label}
                      containerClassName="rounded-none border-b-[1px] border-[#E5E7EB] last:border-b-0"
                      label={field.label}
                      placeholder={field.placeholder}
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
                  )
                )}
              </List>
            </Block>
          ) : (
            <List>
              {prizeTemplatesData?.map((prizeTemplate, index) => (
                <ListItem
                  key={String(prizeTemplate.type)}
                  id={String(prizeTemplate.type)}
                  title={prizeTemplate.name}
                  onClick={() => {
                    setSelectedPrizeTemplate(String(prizeTemplate.type));
                  }}
                  separator={prizeTemplatesData?.length !== index + 1}
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
