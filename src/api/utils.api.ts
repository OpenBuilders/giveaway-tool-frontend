import {
  IGiveawayPrizeTemplate,
  IGiveawayRequirementTemplate,
  IGiveawayCheckChannelResponse,
  IChannelInfo,
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

export const parseUserId = async (
  file: File,
): Promise<{ total_ids: number; ids: string[] }> => {
  const res = await api.post(
    "/v1/giveaways/parse-ids",
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
): Promise<{ total_ids: number; ids: string[] }> => {
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
