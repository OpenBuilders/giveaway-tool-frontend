import { giveawayApi } from "@/api";
import { useGiveawayStore } from "@/store/giveaway.slice";
import { useMutation } from "@tanstack/react-query";
import type { IGiveawayCreateRequest } from "@/interfaces/giveaway.interface";
import { useNavigate } from "react-router";

export const CreateGiveawayButton = ({
  disabled = false,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  const giveaway = useGiveawayStore((state) => state);
  const navigate = useNavigate();

  const createGiveawayFetch = useMutation({
    mutationFn: async (data: IGiveawayCreateRequest) =>
      await giveawayApi.createGiveaway(data),
    onSuccess: () => {
      navigate("/giveaway/created");
      giveaway.reset();
    },
    onError: () => {
      alert("Error creating giveaway");
    },
  });

  const handleClick = () => {
    createGiveawayFetch.mutate({
      title: giveaway.title,
      winners_count: giveaway.winners_count,
      duration: giveaway.duration,
      description: "Giveaway Description",
      prizes: giveaway.prizes.map((prize, index) => ({
        place: index + 1,
        fields: prize.fields,
        prize_type: prize.type,
      })),
    });
  };

  return (
    <button
      className="w-full bg-button text-white font-medium py-[14px] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick || handleClick}
      disabled={disabled}
    >
      {children || "Create Giveaway"}
    </button>
  );
};
