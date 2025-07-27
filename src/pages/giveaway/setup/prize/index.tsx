import { Input } from "@/components/ui/inputs/Input";
import { List } from "@/components/ui/list/List";
import { useQuery } from "@tanstack/react-query";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getGiveawayPrizeTemplates } from "@/api/utils.api";
import { ListItem } from "@/components/ui/list/ListItem";
import { Select } from "@/components/ui/inputs/SelectInput";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { GiveawayPrizeTemplateType } from "@/interfaces/giveaway.interface";
import {
  Block,
  Text,
  PageLayout,
  TelegramMainButton,
} from "@/components/kit";
import { getPrizeIcon } from "@/assets/icons/helper";

// Fallback prize template for when API is not available
const fallbackPrizeTemplate = {
  name: "Custom Prize",
  description: "Create your own custom prize",
  type: "custom" as GiveawayPrizeTemplateType,
};

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

  const { data: prizeTemplatesData, error, isLoading } = useQuery({
    queryKey: ["prize-templates"],
    queryFn: getGiveawayPrizeTemplates,
    retry: 3,
    retryDelay: 1000,
  });

  // Use fallback if API fails or returns no data
  const availableTemplates = prizeTemplatesData && prizeTemplatesData.length > 0 
    ? prizeTemplatesData 
    : [fallbackPrizeTemplate];

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

  // Debug-Logging
  console.log("Prize Templates Data:", prizeTemplatesData);
  console.log("Error:", error);
  console.log("Loading:", isLoading);
  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("Available Templates:", availableTemplates);

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
              prize_type:
                GiveawayPrizeTemplateType[
                  Object.keys(GiveawayPrizeTemplateType).find(
                    (key) =>
                      GiveawayPrizeTemplateType[
                        key as keyof typeof GiveawayPrizeTemplateType
                      ] === selectedPrizeTemplate,
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
          {isLoading ? (
            <Block>
              <Text type="text" align="center">Loading prize templates...</Text>
            </Block>
          ) : error ? (
            <Block>
              <Text type="text" align="center">
                Error loading prize templates: {error.message}
              </Text>
              <Text type="caption" align="center">
                API URL: {import.meta.env.VITE_API_URL || "Not set"}
              </Text>
            </Block>
          ) : selectedPrizeTemplate ? (
            <Block gap={24}>
              <Select
                label="Type"
                type="withIcon"
                options={
                  availableTemplates?.map((prizeTemplate) => ({
                    value: String(prizeTemplate.type),
                    label: prizeTemplate.name,
                  })) || []
                }
                selectedValue={String(selectedPrizeTemplate)}
                onChange={(value) => {
                  setSelectedPrizeTemplate(String(value));
                }}
              />

              {selectedPrizeTemplate === GiveawayPrizeTemplateType.Custom && (
                <List header="Prize Description" className="bg-section-bg">
                  <Input
                    rows={2}
                    className="px-4 py-2.5 !h-[auto] !min-h-[66px] resize-none"
                    type="textarea"
                    placeholder="e.g. "Cap with logo", "2x Concert Tickets", "Meet & Greet""
                    value={
                      fieldsData.find((f) => f.label === "Prize Description")?.value
                    }
                    onChange={(value) => {
                      setFieldsData((prev) => {
                        const existingField = prev.find(
                          (f) => f.label === "Prize Description",
                        );
                        if (existingField) {
                          return prev.map((f) => {
                            if (f.label === "Prize Description") {
                              return {
                                ...f,
                                value,
                              };
                            }
                            return f;
                          });
                        }
                        return [...prev, { type: "text", value, label: "Prize Description", placeholder: "" }];
                      });
                    }}
                  />
                </List>
              )}
            </Block>
          ) : (
            <List>
              {availableTemplates.map((prizeTemplate, index) => (
                <ListItem
                  key={String(prizeTemplate.type)}
                  id={String(prizeTemplate.type)}
                  logo={getPrizeIcon(prizeTemplate.type)}
                  title={prizeTemplate.name}
                  onClick={() => {
                    setSelectedPrizeTemplate(String(prizeTemplate.type));
                  }}
                  separator={availableTemplates?.length !== index + 1}
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
