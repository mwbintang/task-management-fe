import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { mockTickets, mockProjects } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Backlog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const backlogTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      const isBacklog = ticket.status === "backlog";
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = projectFilter === "all" || ticket.projectId === projectFilter;

      return isBacklog && matchesSearch && matchesProject;
    });
  }, [searchQuery, projectFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Backlog</h1>
          <p className="text-muted-foreground mt-1">All tickets in backlog status</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Backlog Tickets ({backlogTickets.length})
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {backlogTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No backlog tickets found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Support Level</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backlogTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                      <TableCell className="font-medium">{ticket.title}</TableCell>
                      <TableCell className="text-sm">
                        {mockProjects.find((p) => p.id === ticket.projectId)?.name}
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.supportLevel}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ticket.assignedTo || "Unassigned"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Backlog;
