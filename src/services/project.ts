import { apiClient } from "@/lib/apiClient";

export async function fetchProject() {
  return apiClient(`project`, {
    method: "GET",
  });
}