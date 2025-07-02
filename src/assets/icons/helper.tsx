import {
  GiveawayPrizeTemplateType,
  GiveawayRequirementType,
} from "@/interfaces/giveaway.interface";
import { SubscribeIcon } from "./requirements/SubscribeIcon";
import { CustomIcon } from "./prizes/CustomIcon";
import { BoostIcon } from "./requirements/BoostIcon";
import { WhiteListIcon } from "./requirements/WhiteListIcon";

export const getRequirementIcon = (type: GiveawayRequirementType) => {
  switch (type) {
    case "subscription":
      return <SubscribeIcon />;
    case "boost":
      return <BoostIcon />;
    case "custom":
      return <WhiteListIcon />;
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
