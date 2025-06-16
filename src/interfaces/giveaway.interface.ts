// export interface IGiveawayPrize {
//   name: string;
//   places: {
//     from: number;
//     to: number;
//   };
//   items: {
//     id: string;
//     name: string;
//   }[];
// }

export type GiveawayPrizeTemplateType = "custom";
export type GiveawayRequirementType = "subscription";
export type GiveawayStatus =
  | "active"
  | "cancelled"
  | "completed"
  | "pending"
  | "paused"
  | "deleted";

export const GiveawayPrizeTemplateType = {
  Custom: "custom",
} as const;

export interface IGiveawayPrize {
  prize_id?: string;
  prize_type: GiveawayPrizeTemplateType;
  fields: {
    [key: string]: string;
  }[];
}

export interface IGiveawayRequirement {
  name?: string;
  type: GiveawayRequirementType;
  username?: string;
  avatar_url?: string;
}

export interface IGiveawayWinners {
  user_id: number;
  username: string;
  place: number;
}

export interface IGiveawayCreator {
  id: number;
  title: string;
  username?: string;
  avatar_url?: string;
  channel_url?: string;
}

export interface IGiveaway {
  id: string;
  title: string;
  winners_count: number;
  winners: IGiveawayWinners[];
  duration: number;
  prizes: IGiveawayPrize[];
  requirements: IGiveawayRequirement[];
  sponsors: IGiveawayCreator[];
  status: GiveawayStatus;
  can_edit: boolean;
  ends_at: string;
  participants_count: number;
  user_role?: "owner" | "user" | "participant" | "winner";
  msg_id?: number;
}

export interface IGiveawayActions {
  setWinners: (winners: number) => void;
  setDuration: (duration: number) => void;
  setTitle: (title: string) => void;

  setPrizes: (prizes: IGiveawayPrize[]) => void;
  updatePrize: (index: number, prize: IGiveawayPrize) => void;
  addPrize: (prize: IGiveawayPrize) => void;

  setRequirements: (requirements: IGiveawayRequirement[]) => void;
  addRequirement: (requirement: IGiveawayRequirement) => void;
  removeRequirement: (index: number) => void;

  setSponsors: (sponsors: IGiveawayCreator[]) => void;
  addSponsor: (sponsor: IGiveawayCreator) => void;
  removeSponsor: (index: number) => void;

  reset(): void;
}

export interface IGiveawayCreateRequest {
  allow_tickets?: boolean;
  auto_distribute?: boolean;
  description?: string;
  duration: number;
  max_participants?: number;
  prizes: {
    place: number | "all";
    prize_id?: string;
    prize_type: string;
    fields: {
      [key: string]: string;
    }[];
  }[];
  requirements?: IGiveawayRequirement[];
  sponsors?: {
    id: number;
  }[];
  title?: string;
  winners_count: number;
}

export interface IGiveawayPrizeTemplate {
  name: string;
  description: string;
  type: GiveawayPrizeTemplateType;
}

export interface IGiveawayRequirementTemplate {
  id: string;
  name: string;
  type: GiveawayRequirementType;
}

export interface IGiveawayCheckChannelResponse {
  results: {
    username: string;
    ok: boolean;
    error?: string;
    channel: {
      id: number;
      type: string;
      title: string;
      username: string;
    };
    bot_status: {
      status: string;
      can_check_members: boolean;
    };
  }[];
}

export interface IGiveawayCheckRequirementsResponse {
  giveaway_id: string;
  results: {
    name: string;
    type: GiveawayRequirementType;
    username: string;
    status: "failed" | "success";
    error?: string;
    link?: string; // URL to redirect users to (Telegram channel/chat)
    chat_info: {
      title: string;
      username: string;
      type: string;
      avatar_url: string;
    };
  }[];
  all_met: boolean;
}

export interface IChannelInfo {
  id: number;
  title?: string;
  username: string;
  avatar_url: string;
  channel_url: string;
}

export interface IAvailableChannelsResponse {
  channels: IChannelInfo[];
}
