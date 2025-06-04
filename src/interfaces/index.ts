import { ReactNode } from "react";
import type {
  IGiveawayPrize,
  IGiveawayRequirement,
} from "./giveaway.interface";

export interface IListItem {
  id: string;
  logo?: string | ReactNode;
  title: string;
  description?: string;
  giveaway?: {
    isAdmin: boolean;
    endsAt: string;
    participants: number;
    telegramUsername?: string;
    requirements?: IGiveawayRequirement[];
    prizes?: IGiveawayPrize[];
    winners_count?: number;
  };
  winner?: {
    isWinner: boolean;
    place: number;
  };
}
