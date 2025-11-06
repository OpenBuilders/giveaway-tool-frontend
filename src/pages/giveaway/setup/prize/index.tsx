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
import { Block, Text, PageLayout, TelegramMainButton } from "@/components/kit";
import { getPrizeIcon } from "@/assets/icons/helper";
import { MAX_PRIZE_TITLE_LENGTH } from "@/utils";

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

  const {
    data: prizeTemplatesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["prize-templates"],
    queryFn: getGiveawayPrizeTemplates,
    retry: 3,
    retryDelay: 1000,
  });

  // Use fallback if API fails or returns no data
  const availableTemplates =
    prizeTemplatesData && prizeTemplatesData.length > 0
      ? prizeTemplatesData
      : [fallbackPrizeTemplate];

  useEffect(() => {
    if (!selectedPrizeTemplate) {
      setCreateButtonDisabled(true);
      return;
    }
    // Require Title for prize creation; quantity if present must be > 0; title must be <= 20 chars
    const titleValue = fieldsData.find((f) => f.label === "Title")?.value || "";
    const quantityRaw =
      fieldsData.find((f) => f.label === "Quantity")?.value || "";
    const quantityOk = quantityRaw === "" || Number(quantityRaw) > 0;
    const titleOk =
      titleValue.trim().length > 0 &&
      titleValue.length <= MAX_PRIZE_TITLE_LENGTH;
    setCreateButtonDisabled(!(titleOk && quantityOk));
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
              prize_type:
                GiveawayPrizeTemplateType[
                  Object.keys(GiveawayPrizeTemplateType).find(
                    (key) =>
                      GiveawayPrizeTemplateType[
                        key as keyof typeof GiveawayPrizeTemplateType
                      ] === selectedPrizeTemplate,
                  ) as keyof typeof GiveawayPrizeTemplateType
                ],
              fields: [
                // Persist in fields so the setup page can map to the new request shape
                {
                  type: "text",
                  name: "title",
                  value:
                    fieldsData.find((f) => f.label === "Title")?.value || "",
                },
                {
                  type: "text",
                  name: "description",
                  value:
                    fieldsData.find((f) => f.label === "Description")?.value ||
                    "",
                },
                {
                  type: "number",
                  name: "quantity",
                  value:
                    fieldsData.find((f) => f.label === "Quantity")?.value || "",
                },
              ],
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
              <Text type="text" align="center">
                Loading prize templates...
              </Text>
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
                <Block gap={12}>
                  <List header="Prize Title" className="bg-section-bg">
                    <Input
                      className="px-4 py-2.5"
                      type="text"
                      placeholder="e.g. Cap with logo"
                      maxLength={MAX_PRIZE_TITLE_LENGTH}
                      value={fieldsData.find((f) => f.label === "Title")?.value}
                      onChange={(value) => {
                        setFieldsData((prev) => {
                          const existingField = prev.find(
                            (f) => f.label === "Title",
                          );
                          if (existingField) {
                            return prev.map((f) =>
                              f.label === "Title" ? { ...f, value } : f,
                            );
                          }
                          return [
                            ...prev,
                            {
                              type: "text",
                              value,
                              label: "Title",
                              placeholder: "",
                            },
                          ];
                        });
                      }}
                    />
                  </List>

                  <List header="Description" className="bg-section-bg">
                    <Input
                      rows={2}
                      className="!h-[auto] !min-h-[66px] resize-none px-4 py-2.5"
                      type="textarea"
                      placeholder="Optional description"
                      value={
                        fieldsData.find((f) => f.label === "Description")?.value
                      }
                      onChange={(value) => {
                        setFieldsData((prev) => {
                          const existingField = prev.find(
                            (f) => f.label === "Description",
                          );
                          if (existingField) {
                            return prev.map((f) =>
                              f.label === "Description" ? { ...f, value } : f,
                            );
                          }
                          return [
                            ...prev,
                            {
                              type: "text",
                              value,
                              label: "Description",
                              placeholder: "",
                            },
                          ];
                        });
                      }}
                    />
                  </List>

                  <List header="Quantity" className="bg-section-bg">
                    <Input
                      className="px-4 py-2.5"
                      type="number"
                      placeholder="1"
                      value={
                        fieldsData.find((f) => f.label === "Quantity")?.value
                      }
                      onChange={(value) => {
                        setFieldsData((prev) => {
                          const existingField = prev.find(
                            (f) => f.label === "Quantity",
                          );
                          if (existingField) {
                            return prev.map((f) =>
                              f.label === "Quantity" ? { ...f, value } : f,
                            );
                          }
                          return [
                            ...prev,
                            {
                              type: "number",
                              value,
                              label: "Quantity",
                              placeholder: "1",
                            },
                          ];
                        });
                      }}
                    />
                  </List>
                </Block>
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
