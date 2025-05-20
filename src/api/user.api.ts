import api from "./helper";

export const getUser = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const res = await api.get("/v1/users/me");
  return res.data;
};
