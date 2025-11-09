import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/types/ticket";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    backlog: { label: "Backlog", color: "bg-muted-foreground" },
    todo: { label: "To Do", color: "bg-status-todo" },
    "in-progress": { label: "In Progress", color: "bg-status-in-progress" },
    completed: { label: "Completed", color: "bg-status-completed" },
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn(config.color, "text-white", className)} variant="secondary">
      {config.label}
    </Badge>
  );
};
