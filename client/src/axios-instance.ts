// In your axios-instance.ts file
import axios from "axios";

const backend = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:5000",
  timeout: 60000,
  headers: { "X-Custom-Header": "foobar" },
});

// Store the getToken function for use in interceptors
let tokenGetter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

// Add request interceptor to get fresh token on each request
backend.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default backend;
