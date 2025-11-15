import { apiClient } from "@/lib/apiClient";

interface FetchTicketsParams {
  search?: string;
  status?: string;
  priority?: string;
  escalation?: string;
}

export async function fetchAllTickets(params: FetchTicketsParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });

  return apiClient(`ticket?${query.toString()}`, {
    method: "GET",
  });
}

export async function fetchTicketById(id: string) {
  return apiClient(`ticket/${id}`, {
    method: "GET",
  });
}

export async function updateTicketStatus(ticketId: string, newStatus: string) {
  return apiClient(`ticket/${ticketId}/status`, {
    method: "PATCH",
    body: {
      status: newStatus
    }
  });
}

export async function createTicket(body: any) {
  return apiClient("ticket", {
    method: "POST",
    body: body,
  });
}
