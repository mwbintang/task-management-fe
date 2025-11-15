const getEnv = (key: string, fallback: string = ""): string => {
  const envValue = (import.meta.env as Record<string, string | undefined>)[key];
  if (!envValue) {
    if (fallback !== "") return fallback;
    console.warn(`Environment variable ${key} is not set`);
  }
  return envValue || fallback;
};

// Use VITE_ prefix for environment variables
export const API_BASE_URL = getEnv("VITE_REACT_APP_API_BASE_URL", "");
export const BASE_URL = getEnv("VITE_REACT_APP_BASE_URL", "");