import axios from "axios";

// ✅ 기본값: 로컬 백엔드(환경변수 없을 때)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:8080";

const TOKEN_KEY = "accessToken";

export const getAccessToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAccessToken = (token) => {
  if (!token) return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    return;
  }
};

export const clearAccessToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    return;
  }
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청에 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// ✅ 에러 메시지 통일
apiClient.interceptors.response.use(
  (response) => {
    const authHeader =
      response.headers?.authorization ||
      response.headers?.Authorization ||
      response.headers?.["access-token"] ||
      response.headers?.["x-access-token"];
    if (authHeader) {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;
      setAccessToken(token);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export const apiRequest = async (path, options = {}) => {
  const response = await apiClient.request({
    url: path,
    ...options,
  });
  return response.data;
};
