// src/api/gymApi.js
import axiosInstance from "./axiosInstance";

export const getTopGyms = () => axiosInstance.get("/gyms");
export const getAllGyms = () => axiosInstance.get("/gyms/all");
export const getGymById = (id) => axiosInstance.get(`/gyms/${id}`);
export const getAdminGymDetail = (id) => axiosInstance.get(`/gyms/${id}/admin-detail`);
export const getGymByOwner = (ownerId) => axiosInstance.get(`/gyms/owner/${ownerId}`);
export const updateGym = (gymId, data) => axiosInstance.put(`/gyms/${gymId}`, data);
export const approveGym = (gymId) => axiosInstance.put(`/gyms/${gymId}/approve`);