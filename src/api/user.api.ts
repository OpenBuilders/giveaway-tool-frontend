import api from "./helper";

export const getUser = async () => {
  const res = await api.get("/v1/users/me");
  return res.data;
};
