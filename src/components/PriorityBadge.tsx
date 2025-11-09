import { Badge } from "@/components/ui/badge";
import { TicketPriority } from "@/types/ticket";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react";

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const priorityConfig = {
    low: { label: "Low", color: "bg-priority-low", icon: ArrowDown },
    medium: { label: "Medium", color: "bg-priority-medium", icon: Minus },
    high: { label: "High", color: "bg-priority-high", icon: ArrowUp },
    critical: { label: "Critical", color: "bg-priority-critical", icon: AlertTriangle },
  };

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge className={cn(config.color, "text-white flex items-center gap-1", className)} variant="secondary">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
