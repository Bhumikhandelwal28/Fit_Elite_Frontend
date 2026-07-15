// src/api/planApi.js
import axiosInstance from "./axiosInstance";

export const getPlansByGym = (gymId, includeInactive = false) =>
  axiosInstance.get(`/subscription-plans/gym/${gymId}?includeInactive=${includeInactive}`);

export const createPlan = (gymId, data) =>
  axiosInstance.post(`/subscription-plans/gym/${gymId}`, data);

export const updatePlan = (planId, data) =>
  axiosInstance.put(`/subscription-plans/${planId}`, data);

export const deletePlan = (planId) =>
  axiosInstance.delete(`/subscription-plans/${planId}`);

export const togglePlanVisibility = (planId) =>
  axiosInstance.patch(`/subscription-plans/${planId}/toggle-visibility`);