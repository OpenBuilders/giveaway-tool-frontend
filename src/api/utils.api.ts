import {
  IGiveawayPrizeTemplate,
  IGiveawayRequirementTemplate,
  IGiveawayCheckChannelResponse,
  IChannelInfo,
  IUserPreviewCheckWinnerResponse,
} from "@/interfaces/giveaway.interface";
import api from "./helper";

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
  usernames: string[],
): Promise<IGiveawayCheckChannelResponse> => {
  const res = await api.post("/v1/requirements/channels/check-bulk", {
    usernames,
  });
  return res.data;
};

export const getChannelInfo = async (
  username: string,
): Promise<IChannelInfo> => {
  const res = await api.get(`/v1/channels/${username}/info`);
  return res.data;
};

export const loadPreviewWinnerList = async (
  file: File,
): Promise<IUserPreviewCheckWinnerResponse> => {
  const res = await api.post(
    "/v1/giveaways/manual-candidates/preview",
    { file },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};

export const loadPreWinnerList = async (
  file: File,
  giveawayId: string,
): Promise<IUserPreviewCheckWinnerResponse> => {
  const res = await api.post(
    `/v1/giveaways/${giveawayId}/manual-candidates`,
    { file },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};

export const getLoadedWinnersList = async (
  giveawayId: string,
): Promise<IUserPreviewCheckWinnerResponse> => {
  const res = await api.get(
    `/v1/giveaways/${giveawayId}/list-loaded-winners`,
  );
  return res.data;
};

export const clearLoadedWinners = async (
  giveawayId: string,
): Promise<void> => {
  const res = await api.delete(
    `/v1/giveaways/${giveawayId}/loaded-winners`,
  );
  return res.data;
};
