import axiosInstance from "./axiosInstance";

export const registerMember = (data) =>
  axiosInstance.post("/auth/register/member", data);

export const registerGymOwner = (data) =>
  axiosInstance.post("/auth/register/gym-owner", data);

export const login = (data) =>
  axiosInstance.post("/auth/login", data);

export const changePassword = (data) =>
  axiosInstance.post("/auth/change-password", data);

export const getMyProfile = () => axiosInstance.get("/auth/me");
export const updateMyProfile = (data) => axiosInstance.put("/auth/me", data);
export const refreshToken = (refreshTokenValue) =>
  axiosInstance.post("/auth/refresh-token", { refreshToken: refreshTokenValue });