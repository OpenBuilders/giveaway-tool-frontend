import type {
  IGiveaway,
  IGiveawayActions,
} from "@/interfaces/giveaway.interface";
import { create } from "zustand";

export const useGiveawayStore = create<IGiveaway & IGiveawayActions>((set) => ({
  winners: 0,
  duration: 60 * 24, // 1 day
  prizes: [],
  requirements: [],
  setWinners: (winners) => set({ winners }),
  setDuration: (duration) => set({ duration }),

  setPrizes: (prizes) => set({ prizes }),
  updatePrize: (index, prize) =>
    set((state) => {
      const newPrizes = [...state.prizes];
      newPrizes[index] = prize;

      return { prizes: newPrizes };
    }),
  addEmptyPrize: () =>
    set((state) => ({
      prizes: [
        ...state.prizes,
        {
          name: "Grand Prize",
          places: {
            from: 0,
            to: 0,
          },
          items: [],
        },
      ],
    })),

  setRequirements: (requirements) => set({ requirements }),
  reset: () =>
    set({
      winners: 0,
      duration: "1d",
      prizes: [],
      requirements: [],
    }),
}));
