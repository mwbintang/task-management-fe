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
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const authToken = token || localStorage.getItem("token");
  if (authToken) finalHeaders["Authorization"] = `Bearer ${authToken}`;

  const config: RequestInit = {
    method,
    headers: finalHeaders,
    ...options,
  };

  if (body) config.body = typeof body === "string" ? body : JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (res.status === 401) {
    console.warn("Token expired or invalid. Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // redirect user back to login page
    window.location.href = "/";
    return Promise.reject(new Error("Session expired. Please log in again."));
  }

  if (!res.ok) {
    let errorMsg = `API error: ${res.status} ${res.statusText}`;
    try {
      const errData = await res.json();
      errorMsg = errData?.message || errorMsg;
    } catch {
      // ignore JSON parsing errors
    }
    throw new Error(errorMsg);
  }

  return res.json() as Promise<T>;
}
