import type {
  IGiveawayCreateRequest,
  IGiveaway,
  IGiveawayCheckRequirementsResponse,
} from "@/interfaces/giveaway.interface";
import api from "./helper";

export const getMyGiveaways = async (): Promise<IGiveaway[]> => {
  const res = await api.get("/v1/giveaways/me/all");
  return res.data;
};

export const createGiveaway = async (
  data: IGiveawayCreateRequest
): Promise<IGiveaway> => {
  const res = await api.post("/v1/giveaways", data);
  return res.data;
};

export const getTopGiveaways = async (): Promise<IGiveaway[]> => {
  const res = await api.get("/v1/giveaways", {
    params: {
      limit: 100,
      offset: 0,
    },
  });
  return res.data;
};

export const getGiveawayById = async (id: string): Promise<IGiveaway> => {
  const res = await api.get(`/v1/giveaways/${id}`);
  return res.data;
};

export const joinToGiveaway = async (id: string): Promise<void> => {
  const res = await api.post(`/v1/giveaways/${id}/join`);
  return res.data;
};

export const checkGiveawayRequirements = async (id: string): Promise<IGiveawayCheckRequirementsResponse> => {
  const res = await api.get(`/v1/giveaways/${id}/check-requirements`);
  return res.data;
};