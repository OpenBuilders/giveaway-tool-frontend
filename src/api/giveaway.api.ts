import type {
  IGiveawayCreateRequest,
  IGiveaway,
  IGiveawayPrizeTemplate,
  IGiveawayRequirementTemplate,
  IGiveawayCheckChannelResponse,
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
  const res = await api.get("/v1/giveaways/top");
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

export const getGiveawayPrizeTemplates = async (): Promise<
  IGiveawayPrizeTemplate[]
> => {
  const res = await api.get("/v1/prizes/templates");
  return res.data;
};

export const getGiveawayRequirementsTemplates = async (): Promise<
  IGiveawayRequirementTemplate[]
> => {
  const res = await api.get("/v1/requirements/templates");
  return res.data;
};

export const checkChannel = async (
  username: string
): Promise<IGiveawayCheckChannelResponse> => {
  const res = await api.post("/v1/bot/check", { username });
  return res.data;
};
