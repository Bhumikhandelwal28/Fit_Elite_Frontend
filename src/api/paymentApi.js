import axiosInstance from "./axiosInstance";

export const subscribeToPlan = (data) => axiosInstance.post("/payments", data);

export const getPaymentsByMember = (memberId) =>
  axiosInstance.get(`/payments/member/${memberId}`);

export const getPaymentsByGym = (gymId) =>
  axiosInstance.get(`/payments/gym/${gymId}`);