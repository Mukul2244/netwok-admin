import axios from "axios";
import getCookie from "@/lib/getCookie";

const axiosInstance = axios.create({
  baseURL: "https://rk4huq4sfe.execute-api.eu-north-1.amazonaws.com",
  headers: {
    "Content-Type": "application/json",
  },
});

const api = axios.create({
  baseURL: "https://rk4huq4sfe.execute-api.eu-north-1.amazonaws.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to attach the token dynamically
api.interceptors.request.use(async (config) => {
  const token = await getCookie("accessToken"); // Get token from server cookies

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Add an interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await api.post('/api/refresh',{
          refreshToken: await getCookie("refreshToken")
        })
        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { axiosInstance };
