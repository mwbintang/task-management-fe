import { apiClient } from "@/lib/apiClient";

export async function loginService(email: string, password: string) {
  return apiClient("login", {
    method: "POST",
    body: {
        email,
        password
    }
  });
}