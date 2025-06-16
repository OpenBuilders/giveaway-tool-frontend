import {
  GiveawayPrizeTemplateType,
  GiveawayRequirementType,
} from "@/interfaces/giveaway.interface";
import { SubscribeIcon } from "./requirements/SubscribeIcon";
import { CustomIcon } from "./prizes/CustomIcon";

export const getRequirementIcon = (type: GiveawayRequirementType) => {
  switch (type) {
    case "subscription":
      return <SubscribeIcon />;
    default:
      return null;
  }
};

export const getPrizeIcon = (type: GiveawayPrizeTemplateType) => {
  switch (type) {
    case "custom":
      return <CustomIcon />;
    default:
      return null;
  }
};
