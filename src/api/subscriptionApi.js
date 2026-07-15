// src/api/subscriptionApi.js
import axiosInstance from "./axiosInstance";

export const getMySubscriptions = () => axiosInstance.get("/member-subscriptions/my");
export const cancelSubscription = (id) => axiosInstance.put(`/member-subscriptions/${id}/status`, { status: "Cancelled" });
export const getSubscriptionsByGym = (gymId) => axiosInstance.get(`/member-subscriptions/gym/${gymId}`);
export const getSubscriptionsByMember = (memberId) => axiosInstance.get(`/member-subscriptions/member/${memberId}`); 