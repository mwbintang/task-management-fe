import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "@/types/ticket";
import { TicketCard } from "./TicketCard";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useToast } from "@/hooks/use-toast";
import { updateTicketStatus } from "@/services/ticket";

interface KanbanBoardProps {
  tickets: Ticket[];
}

const statusColumns = [
  { status: "todo", title: "To Do" },
  { status: "in-progress", title: "In Progress" },
  { status: "completed", title: "Completed" },
] as const;

type TicketStatus = (typeof statusColumns)[number]["status"];

// ✅ Draggable wrapper for tickets
const DraggableTicket = ({ ticket }: { ticket: Ticket }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket._id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "opacity-50" : ""}
    >
      <TicketCard ticket={ticket} isDraggable />
    </div>
  );
};

// ✅ Droppable column wrapper
const DroppableColumn = ({
  status,
  title,
  tickets,
}: {
  status: TicketStatus;
  title: string;
  tickets: Ticket[];
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Card ref={setNodeRef} className={`flex flex-col ${isOver ? "border-primary border-2" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">{tickets.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3 min-h-[200px]">
          {tickets.map((ticket) => (
            <DraggableTicket key={ticket._id} ticket={ticket} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const KanbanBoard = ({ tickets: initialTickets }: KanbanBoardProps) => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t._id === event.active.id);
    if (ticket) setActiveTicket(ticket);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id as string;
    const newStatus = over.id as TicketStatus;

    // Optimistic update
    setTickets((prev) =>
      prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTicketStatus(ticketId, newStatus);

      toast({
        title: "Ticket Updated",
        description: `Ticket moved to ${statusColumns.find((c) => c.status === newStatus)?.title
          }`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update ticket status",
        variant: "destructive",
      });

      // Rollback on failure
      setTickets((prev) =>
        prev.map((t) =>
          t._id === ticketId ? { ...t, status: active.data.current.status } : t
        )
      );
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusColumns.map((col) => (
          <DroppableColumn
            key={col.status}
            status={col.status}
            title={col.title}
            tickets={tickets.filter((t) => t.status === col.status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTicket ? (
          <div className="opacity-50">
            <TicketCard ticket={activeTicket} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
