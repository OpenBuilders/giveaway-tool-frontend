import api from "./helper";

export const generateTonProofPayload = async () => {
  const res = await api.get(`/v1/ton-proof/generatePayload`);
  return res.data;
};

export type TonProofDomain = { lengthBytes: number; value: string };

export type TonProofData = {
  timestamp: number;
  domain: TonProofDomain;
  signature: string;
  payload: string;
};

export type VerifyTonProofRequest = {
  proof: TonProofData;
  address: string;
  network: "-239" | "-1";
};

export const verifyTonProof = async (data: VerifyTonProofRequest) => {
  const res = await api.post(`/v1/ton-proof/checkProof`, data);
  return res.data;
};

export * as userApi from "./user.api";
export * as giveawayApi from "./giveaway.api";
export * as utilsApi from "./utils.api";