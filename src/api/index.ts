import api from "./helper";

export const generateTonProofPayload = async () => {
  const res = await api.post(`/v1/user/tonproof/payload`);
  return res.data;
};

export const verifyTonProof = async (data: {
  proof: any;
  address: any;
  publicKey: any;
  walletStateInit: any;
}) => {
  const res = await api.post(`/v1/user/tonproof/verify`, data);
  return res.data;
};

export * as userApi from "./user.api";
export * as giveawayApi from "./giveaway.api";
export * as utilsApi from "./utils.api";