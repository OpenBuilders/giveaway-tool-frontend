import { IAvailableChannelsResponse } from "@/interfaces/giveaway.interface";
import api from "./helper";

export const getUser = async () => {
  const res = await api.get("/v1/users/me");
  return res.data;
};

export const getAvailableChannels = async (): Promise<IAvailableChannelsResponse> => {
  const res = await api.get("/v1/users/me/channels");
  return res.data;
};