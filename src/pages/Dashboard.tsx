import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketCard } from "@/components/TicketCard";
import { mockTickets, mockProjects } from "@/lib/mockData";
import { TicketStatus, TicketPriority, Ticket, SupportLevel } from "@/types/ticket";
import { Search, Ticket as TicketIcon, AlertCircle, Layers } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SummaryCard } from "@/components/SummaryCard";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CreateTicketDialog } from "@/components/CreateTicketDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket: Ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesProject = !selectedProject || ticket.projectId === selectedProject;

      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }, [searchQuery, statusFilter, priorityFilter, selectedProject]);

  const backlogTickets = filteredTickets.filter((t) => t.status === "backlog");
  const activeTickets = filteredTickets.filter((t) => t.status !== "backlog");

  // Calculate summary stats
  const totalTickets = mockTickets.length;
  const unsolvedTickets = mockTickets.filter((t) => t.status !== "completed").length;
  const l1Tickets = mockTickets.filter((t) => t.supportLevel === "L1").length;
  const l2Tickets = mockTickets.filter((t) => t.supportLevel === "L2").length;
  const l3Tickets = mockTickets.filter((t) => t.supportLevel === "L3").length;

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
            <SummaryCard
              title="L1 Tickets"
              value={l1Tickets}
              icon={<Layers className="h-4 w-4 text-muted-foreground" />}
            />
            <SummaryCard
              title="L2 Tickets"
              value={l2Tickets}
              icon={<Layers className="h-4 w-4 text-muted-foreground" />}
            />
            <SummaryCard
              title="L3 Tickets"
              value={l3Tickets}
              icon={<Layers className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <CreateTicketDialog />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
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
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Kanban Board */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Active Tickets</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Drag tickets between columns to update their status
            </p>
          </div>
          <KanbanBoard tickets={activeTickets} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
