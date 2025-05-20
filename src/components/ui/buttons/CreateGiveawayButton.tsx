import { giveawayApi } from "@/api";
import type { IGiveawayCreateRequest } from "@/interfaces/giveaway.interface";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";

export const CreateGiveawayButton = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const location = useLocation();
  const router = useNavigate();

  const giveaway = useGiveawayStore((state) => state);

  const isGiveawayPage = location.pathname.includes("/giveaway/setup");
  const isPrizePage = location.pathname.includes("/giveaway/setup/prize");

  const createGiveawayFetch = useMutation({
    mutationFn: async (data: IGiveawayCreateRequest) =>
      await giveawayApi.createGiveaway(data),
    onSuccess: (data) => {
      alert("Giveaway created successfully");
    },
    onError: (error) => {
      alert("Error creating giveaway");
    },
  });

  const handleClick = () => {
    if (isGiveawayPage) {
      if (isPrizePage) {
        router("/giveaway/setup");
      } else {
        // needPrize 
        // place: 
        // prize_id: 
        // prize_type: 

        createGiveawayFetch.mutate({
          title: "Giveaway Title",
          description: "Giveaway Description",
          winners_count: giveaway.winners,
          duration: giveaway.duration,
          prizes: giveaway.prizes.map((prize, index) => ({
            place: index + 1,
            prize_id: `#${index + 1}`,
            prize_type: "custom",
          })),
        });
      }
    } else {
      router("/giveaway/setup");
    }
  };

  return (
    <button
      className="w-full bg-button text-white font-medium py-[14px] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleClick}
      disabled={disabled}
    >
      {isPrizePage && <>Save Prize Tier</>}
      {isGiveawayPage && !isPrizePage && <>Create Giveaway</>}
      {!isGiveawayPage && <>Create Giveaway</>}
    </button>
  );
};
