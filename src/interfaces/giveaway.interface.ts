export interface IGiveawayPrize {
  name: string;
  places: {
    from: number;
    to: number;
  };
  items: {
    id: string;
    name: string;
  }[];
}

export interface IGiveawayRequirment {
  name: string;
  value: string[] | string;
  type: "stars" | "channel" | "boost";
}

export interface IGiveaway {
  winners: number;
  duration: number;
  prizes: IGiveawayPrize[];
  requirements: IGiveawayRequirment[];
}

export interface IGiveawayActions {
  setWinners: (winners: number) => void;
  setDuration: (duration: string) => void;

  setPrizes: (prizes: IGiveawayPrize[]) => void;
  updatePrize: (index: number, prize: IGiveawayPrize) => void;
  addEmptyPrize: () => void;

  setRequirements: (requirements: IGiveawayRequirment[]) => void;
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
    prize_id: string;
    prize_type: string;
  }[];
  requirements?: {
    enabled: boolean;
    join_type: string;
    requirements: {
      chat_id: string;
      chat_name: string;
      chat_type: "channel";
      type: "subscription";
    }[];
  };
  title?: string;
  winners_count: number;
}