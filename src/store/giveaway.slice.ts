import type {
  IGiveaway,
  IGiveawayActions,
  IGiveawayPrize,
  IGiveawayRequirement,
} from "@/interfaces/giveaway.interface";
import { create } from "zustand";

export const useGiveawayStore = create<IGiveaway & IGiveawayActions>((set) => ({
  id: "",
  status: "active",
  can_edit: false,
  ends_at: "",
  participants_count: 0,
  winners: [],

  title: "",
  winners_count: 0,
  duration: 60 * 24, // 1 day
  prizes: [],
  requirements: [],
  setWinners: (winners) => set({ winners_count: winners }),
  setDuration: (duration) => set({ duration }),
  setTitle: (title) => set({ title }),

  setPrizes: (prizes) => set({ prizes }),
  updatePrize: (index, prize) =>
    set((state) => {
      const newPrizes = [...state.prizes];
      newPrizes[index] = prize;

      return { prizes: newPrizes };
    }),
  addPrize: (prize: IGiveawayPrize) =>
    set((state) => ({ prizes: [...state.prizes, prize] })),

  setRequirements: (requirements) => set({ requirements }),
  addRequirement: (requirement: IGiveawayRequirement) =>
    set((state) => ({ requirements: [...state.requirements, requirement] })),
  reset: () =>
    set({
      title: "",
      winners_count: 0,
      duration: 60 * 24,
      prizes: [],
      requirements: [],
    }),
}));
