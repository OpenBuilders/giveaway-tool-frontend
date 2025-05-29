import type { IGiveawayRequirement } from "./giveaway.interface";

export interface IListItem {
  id: string;
  logo?: string;
  title: string;
  description?: string;
  giveaway?: {
    isAdmin: boolean;
    endsAt: string;
    participants: number;
    telegramUsername?: string;
    requirements?: IGiveawayRequirement[];
  };
}
