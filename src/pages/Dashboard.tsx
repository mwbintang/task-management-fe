import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketCard } from "@/components/TicketCard";
import { TicketStatus, TicketPriority, Ticket } from "@/types/ticket";
import { Search, Ticket as TicketIcon, AlertCircle, Layers } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SummaryCard } from "@/components/SummaryCard";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CreateTicketDialog } from "@/components/CreateTicketDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { fetchAllTickets } from "@/services/ticket";

const Dashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");
  const [escalatedFilter, setEscalatedFilter] = useState<"L1" | "L2" | "L3" | "all">("all");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const fetchTickets = async () => {
    if (open) {
      return;
    };

    setLoading(true);
    try {
      const response = await fetchAllTickets({
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        escalation: escalatedFilter !== "all" ? escalatedFilter : undefined,
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Fetch tickets whenever filters/search change
  useEffect(() => {
    fetchTickets();
  }, [searchQuery, statusFilter, priorityFilter, escalatedFilter, open]);

  const totalTickets = tickets.length;
  const unsolvedTickets = tickets.filter((t) => t.status !== "completed").length;
  const l1Tickets = tickets.filter((t) => t.level === "L1").length;
  const l2Tickets = tickets.filter((t) => t.level === "L2").length;
  const l3Tickets = tickets.filter((t) => t.level === "L3").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Summary Cards */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SummaryCard
              title="Total Tickets"
              value={totalTickets}
              trend={{ value: 12, isPositive: true }}
              icon={<TicketIcon className="h-4 w-4 text-muted-foreground" />}
            />
            <SummaryCard
              title="Unsolved Tickets"
              value={unsolvedTickets}
              trend={{ value: 8, isPositive: false }}
              icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
            />
            <SummaryCard title="L1 Tickets" value={l1Tickets} icon={<Layers className="h-4 w-4 text-muted-foreground" />} />
            <SummaryCard title="L2 Tickets" value={l2Tickets} icon={<Layers className="h-4 w-4 text-muted-foreground" />} />
            <SummaryCard title="L3 Tickets" value={l3Tickets} icon={<Layers className="h-4 w-4 text-muted-foreground" />} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <CreateTicketDialog setOpen={setOpen} open={open} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TicketPriority | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={escalatedFilter} onValueChange={(value) => setEscalatedFilter(value as "L1" | "L2" | "L3" | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Escalation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Escalation</SelectItem>
                <SelectItem value="L1">L1</SelectItem>
                <SelectItem value="L2">L2</SelectItem>
                <SelectItem value="L3">L3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-8">
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Active Tickets</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Drag tickets between columns to update their status
            </p>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <KanbanBoard tickets={tickets} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
