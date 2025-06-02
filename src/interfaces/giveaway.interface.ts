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

export interface IGiveawayPrize {
  prize_id?: string;
  prize_type: GiveawayPrizeTemplateType;
  fields: {
    [key: string]: string;
  }[];
}

export interface IGiveawayRequirement {
  name: string;
  value: string[] | string;
  type: "subscription";
}

export type GiveawayStatus = "active" | "cancelled";

export interface IGiveaway {
  id: string;
  title: string;
  winners_count: number;
  duration: number;
  prizes: IGiveawayPrize[];
  requirements: IGiveawayRequirement[];
  status: GiveawayStatus;
  can_edit: boolean;
  ends_at: string;
  participants_count: number;
  user_role?: "owner" | "user";
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
  reset(): void;
}

export interface IGiveawayCreateRequest {
  allow_tickets?: boolean;
  auto_distribute?: boolean;
  description?: string;
  duration: number;
  max_participants?: number;
  prizes: {
    place: number;
    prize_id?: string;
    prize_type: string;
    fields: {
      [key: string]: string;
    }[];
  }[];
  requirements?: IGiveawayRequirement[];
  title?: string;
  winners_count: number;
}

export type GiveawayPrizeTemplateType = "custom";

export const GiveawayPrizeTemplateType = {
  Custom: "custom",
} as const;

export interface IGiveawayPrizeTemplate {
  name: string;
  description: string;
  type: GiveawayPrizeTemplateType;
}

export interface IGiveawayRequirementTemplate {
  id: string;
  name: string;
  type: "subscription";
}

export interface IGiveawayCheckChannelResponse {
  bot_status: {
    can_check_members: boolean;
    status: string;
  };
  channel: {
    id: number;
    type: string;
    title: string;
    username: string;
  };
}
