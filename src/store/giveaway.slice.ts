import type {
  IGiveaway,
  IGiveawayActions,
  IGiveawayCreator,
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
  creators: [],
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
  removeRequirement: (index) =>
    set((state) => {
      const newRequirements = [...state.requirements];
      newRequirements.splice(index, 1);

      return { requirements: newRequirements };
    }),

  setCreators: (creators) => set({ creators }),
  addCreator: (creator: IGiveawayCreator) =>
    set((state) => ({ creators: [...state.creators, creator] })),
  removeCreator: (index) =>
    set((state) => {
      const newCreators = [...state.creators];
      newCreators.splice(index, 1);

      return { creators: newCreators };
    }),

  reset: () =>
    set({
      title: "",
      winners_count: 0,
      duration: 60 * 24,
      prizes: [],
      requirements: [],
    }),
}));
