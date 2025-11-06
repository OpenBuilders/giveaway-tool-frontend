import {
  GiveawayPrizeTemplateType,
  IGiveawayRequirement,
} from "@/interfaces/giveaway.interface";
import { SubscribeIcon } from "./requirements/SubscribeIcon";
import { CustomIcon } from "./prizes/CustomIcon";
import { BoostIcon } from "./requirements/BoostIcon";
import { WhiteListIcon } from "./requirements/WhiteListIcon";
import { HoldTonIcon } from "./requirements/HoldTonIcon";
import { HoldJettonIcon } from "./requirements/HoldJettonIcon";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { ConnectWalletIcon } from "./requirements/ConnectWalletIcon";
import { toTon } from "@/utils/toTon";

export const getRequirementIcon = (
  requirement: IGiveawayRequirement,
  { isChannel }: { isChannel?: boolean } = {},
) => {
  if (isChannel) {
    return (
      <ChannelAvatar
        title={
          requirement.name?.replace("@", "") ||
          requirement.username?.replace("@", "") ||
          requirement?.chat_info?.title ||
          requirement?.channel?.title
        }
        avatar_url={
          requirement?.avatar_url ||
          requirement?.chat_info?.avatar_url ||
          // `https://t.me/i/userpic/160/${requirement.username?.replace("@", "")}.jpg`
          `${import.meta.env.VITE_API_URL}/public/channels/${requirement.username}/avatar`
        }
      />
    );
  }
  switch (requirement.type) {
    case "subscription":
      if (requirement.avatar_url)
        return (
          <ChannelAvatar
            title={
              requirement.name?.replace("@", "") ||
              requirement.username?.replace("@", "") ||
              requirement.channel?.title
            }
            avatar_url={
              requirement?.avatar_url ||
              requirement?.chat_info?.avatar_url ||
              // `https://t.me/i/userpic/160/${requirement.username?.replace("@", "")}.jpg`
              `${import.meta.env.VITE_API_URL}/public/channels/${requirement.username}/avatar`
            }
          />
        );
      return <SubscribeIcon />;
    case "boost":
      // if (requirement.avatar_url)
      //   return (
      //     <ChannelAvatar
      //       title={
      //         requirement.name?.replace("@", "") ||
      //         requirement.username?.replace("@", "") ||
      //         requirement.channel?.title
      //       }
      //       avatar_url={
      //         requirement?.avatar_url ||
      //         requirement?.chat_info?.avatar_url ||
      //         // `https://t.me/i/userpic/160/${requirement.username?.replace("@", "")}.jpg`
      //         `${import.meta.env.VITE_API_URL}/public/channels/${requirement.username}/avatar`
      //       }
      //     />
      //   );
      return <BoostIcon />;
    case "custom":
      return <WhiteListIcon />;
    case "holdton":
      return <HoldTonIcon />;
    case "holdjetton":
      if (requirement.jetton_image) {
        return (
          <img
            src={requirement.jetton_image}
            alt={requirement?.jetton_symbol || "Jetton"}
            width={40}
            height={40}
          />
        );
      }
      return <HoldJettonIcon />;
    case "connectwallet":
      return <ConnectWalletIcon />;
    default:
      return (
        <ChannelAvatar
          title={
            requirement.type === "custom"
              ? requirement.name
              : requirement.name?.charAt(1)
          }
          avatar_url={requirement.avatar_url}
        />
      );
  }
};

export const getRequirementTitle = (requirement: IGiveawayRequirement) => {
  switch (requirement.type) {
    case "custom":
      return requirement.name;
    case "subscription":
      return `Subscribe ${requirement.username || requirement.channel?.title || requirement.name}`;
    case "boost":
      return `Boost ${requirement.username || requirement.channel?.title || requirement.name}`;
    case "holdton":
      return `Hold ${requirement.ton_min_balance_nano ? toTon(requirement.ton_min_balance_nano) : requirement.amount} TON`;
    case "holdjetton":
      return `Hold ${requirement.jetton_min_amount || requirement.amount} ${"$" + requirement.jetton_symbol || "tokens"}`;
    case "connectwallet":
      return "Connect Wallet";
    default:
      return String(requirement.type);
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
