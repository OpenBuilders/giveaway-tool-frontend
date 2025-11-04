import type {
  IGiveaway,
  IGiveawayActions,
  IGiveawayCreator,
  IGiveawayPrize,
  IGiveawayRequirement,
} from "@/interfaces/giveaway.interface";
import { persist } from "zustand/middleware";
import { create } from "zustand";

export const useGiveawayStore = create<IGiveaway & IGiveawayActions>()(
  persist(
    (set) => ({
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
      sponsors: [],
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
        set((state) => {
          if (
            state.requirements.some(
              (r) =>
                r.username === requirement.username &&
                r.avatar_url === requirement.avatar_url &&
                r.type === requirement.type &&
                r.channel == requirement.channel,
            )
          ) {
            return {
              requirements: state.requirements,
            };
          }
          return {
            requirements: [...state.requirements, requirement],
          };
        }),
      removeRequirement: (index) =>
        set((state) => {
          const newRequirements = [...state.requirements];
          newRequirements.splice(index, 1);

          return { requirements: newRequirements };
        }),

      setSponsors: (sponsors) => set({ sponsors }),
      addSponsor: (sponsor: IGiveawayCreator) =>
        set((state) => ({ sponsors: [...state.sponsors, sponsor] })),
      removeSponsor: (index) =>
        set((state) => {
          const newSponsors = [...state.sponsors];
          newSponsors.splice(index, 1);

          return { sponsors: newSponsors };
        }),

      reset: () =>
        set({
          title: "",
          winners_count: 0,
          duration: 60 * 24,
          prizes: [],
          requirements: [],
          sponsors: [],
        }),
    }),
    {
      name: "giveaway-storage", // ключ в localStorage
      // Можно указать, что именно сохранять:
      // partialize: (state) => ({
      //   title: state.title,
      //   winners_count: state.winners_count,
      //   duration: state.duration,
      //   prizes: state.prizes,
      //   requirements: state.requirements,
      //   sponsors: state.sponsors,
      // }),
      version: 1, // для миграций
      // storage: sessionStorage,      // если нужно sessionStorage вместо localStorage
    },
  ),
);
