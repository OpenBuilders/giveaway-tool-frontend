import {
  GiveawayPrizeTemplateType,
  GiveawayRequirementType,
} from "@/interfaces/giveaway.interface";
import { SubscribeIcon } from "./requirements/SubscribeIcon";
import { CustomIcon } from "./prizes/CustomIcon";
import { BoostIcon } from "./requirements/BoostIcon";
import { WhiteListIcon } from "./requirements/WhiteListIcon";
import { HoldTonIcon } from "./requirements/HoldTonIcon";
import { HoldJettonIcon } from "./requirements/HoldJettonIcon";

export const getRequirementIcon = (type: GiveawayRequirementType) => {
  switch (type) {
    case "subscription":
      return <SubscribeIcon />;
    case "boost":
      return <BoostIcon />;
    case "custom":
      return <WhiteListIcon />;
    case "holdton":
      return <HoldTonIcon />;
    case "holdjetton":
      return <HoldJettonIcon />;
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
