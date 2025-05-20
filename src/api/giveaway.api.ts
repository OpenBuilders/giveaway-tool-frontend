import type { IGiveawayCreateRequest } from "@/interfaces/giveaway.interface";
import api from "./helper";

export const createGiveaway = async (data: IGiveawayCreateRequest) => {
  const res = await api.post("/v1/giveaways", data);
  return res.data;
};
