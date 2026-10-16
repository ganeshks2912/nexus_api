import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexus_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status !== 401 ||
      original?._retry ||
      original?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("nexus_refresh_token");
    if (!refreshToken) return Promise.reject(error);

    original._retry = true;
    try {
      refreshing ||= api.post("/auth/refresh", { refreshToken });
      const response = await refreshing;
      refreshing = null;
      const newToken = response.data.accessToken;
      localStorage.setItem("nexus_access_token", newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      refreshing = null;
      localStorage.removeItem("nexus_access_token");
      localStorage.removeItem("nexus_refresh_token");
      localStorage.removeItem("nexus_user");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
);

export function getErrorMessage(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || fallback;
}

export default api;
