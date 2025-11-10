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

export interface UserRef {
  _id: string;
  name: string;
  email: string;
}

export interface ProjectRef {
  _id: string;
  name: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "backlog" | "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  criticalLevel: "L1" | "L2" | "L3";
  project: ProjectRef;
  assignee?: UserRef;
  reporter: UserRef;
  attachments: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}
