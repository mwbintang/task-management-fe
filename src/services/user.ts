import { apiClient } from "@/lib/apiClient";

export async function loginService(email: string, password: string) {
  return apiClient("user/login", {
    method: "POST",
    body: {
        email,
        password
    }
  });
}

export async function fetchUser() {
  return apiClient(`user`, {
    method: "GET",
  });
}