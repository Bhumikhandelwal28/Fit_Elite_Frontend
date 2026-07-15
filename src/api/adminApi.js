import axiosInstance from "./axiosInstance";

export const getUsersByRole = (role) =>
  axiosInstance.get(`/dashboard/users${role ? `?role=${role}` : ""}`);