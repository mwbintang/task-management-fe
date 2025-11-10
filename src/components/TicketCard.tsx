import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Ticket } from "@/types/ticket";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface TicketCardProps {
  ticket: Ticket;
  isDraggable?: boolean;
}

export const TicketCard = ({ ticket, isDraggable }: TicketCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => navigate(`/ticket/${ticket._id}`);

  const formattedDate = (() => {
    if (!ticket.createdAt) return "N/A";
    const parsed = Date.parse(ticket.createdAt);
    return isNaN(parsed) ? "Invalid Date" : format(new Date(parsed), "MMM dd, yyyy");
  })();

  return (
    <Card
      className={`hover:shadow-md transition-shadow cursor-pointer ${
        isDraggable ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      onClick={handleNavigate}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {ticket.criticalLevel && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded">
                  {ticket.criticalLevel}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-card-foreground line-clamp-2">
              {ticket.title}
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {ticket.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{ticket?.assignee?.name || "Unassigned"}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

          <span className="capitalize">{ticket.status}</span>
        </div>
      </CardContent>
    </Card>
  );
};
