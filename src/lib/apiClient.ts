import { API_BASE_URL } from "./constants/env";

export interface ApiClientOptions extends RequestInit {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  token?: string;
}

export async function apiClient<T = any>(
  endpoint: string,
  { method = "GET", body, headers = {}, token, ...options }: ApiClientOptions = {}
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  // ⚙️ Construct headers conditionally
  const finalHeaders: Record<string, string> = {
    ...headers,
  };

  // Only set Content-Type when NOT FormData
  if (!isFormData && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  // 🔑 Auth token
  const authToken = token || localStorage.getItem("token");
  if (authToken) finalHeaders["Authorization"] = `Bearer ${authToken}`;

  // ⚙️ Config
  const config: RequestInit = {
    method,
    headers: finalHeaders,
    ...options,
  };

  // 🧠 Handle body properly
  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  // 🛰️ Fetch
  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (res.status === 401) {
    console.warn("Token expired or invalid. Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    return Promise.reject(new Error("Session expired. Please log in again."));
  }

  if (!res.ok) {
    let errorMsg = `API error: ${res.status} ${res.statusText}`;
    const errData = await res.json();
    errorMsg = errData?.message || errorMsg;

    throw new Error(errorMsg);
  }

  // Only parse JSON if not expecting a binary response
  return res.json() as Promise<T>;
}
