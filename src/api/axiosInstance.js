import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7145/api",
  headers: { "Content-Type": "application/json" },
});

// ---- REQUEST interceptor(React->interceptor->Backend)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- RESPONSE interceptor 
axiosInstance.interceptors.response.use(
  (response) => {
   //does response data exist
    if (response.data && typeof response.data === "object" && "success" in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
   
    const backendMessage = error.response?.data?.message;

    if (backendMessage) {
      error.message = backendMessage;
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;