import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/types/ticket";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    new: { label: "New", color: "bg-status-new" },
    attending: { label: "Attending", color: "bg-status-attending" },
    completed: { label: "Completed", color: "bg-status-completed" },
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn(config.color, "text-white", className)} variant="secondary">
      {config.label}
    </Badge>
  );
};
