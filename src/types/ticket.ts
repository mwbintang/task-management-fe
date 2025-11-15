export type TicketStatus = "new" | "attending" | "completed";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type SupportLevel = "L1" | "L2" | "L3";

export type TicketCategory = "bug" | "task" | "feature";

export interface User {
  _id: string;
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
  status: TicketStatus;
  priority: "low" | "medium" | "high" | "critical";
  level: "L1" | "L2" | "L3";
  criticalLevel: "C1" | "C2" | "C3";
  category: TicketCategory;
  project: ProjectRef;
  assignee?: UserRef;
  reporter: UserRef;
  attachments: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}
