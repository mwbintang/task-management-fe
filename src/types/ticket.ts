export type TicketStatus = "backlog" | "todo" | "in-progress" | "completed";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type SupportLevel = "L1" | "L2" | "L3";

export type TicketCategory = "technical" | "billing" | "general" | "feature-request";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface TicketLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  notes?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  supportLevel?: SupportLevel;
  category: TicketCategory;
  createdBy: string;
  createdAt: Date;
  expectedCompletionDate: Date;
  assignedTo?: string;
  logs: TicketLog[];
  projectId: string;
}
