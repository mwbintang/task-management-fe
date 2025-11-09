import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { mockTickets, mockProjects } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectTickets = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const project = useMemo(() => {
    return mockProjects.find((p) => p.id === projectId);
  }, [projectId]);

  const projectTickets = useMemo(() => {
    return mockTickets.filter((ticket) => ticket.projectId === projectId);
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Project not found</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              All Tickets ({projectTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tickets found for this project
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Support Level</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                      <TableCell className="font-medium">{ticket.title}</TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
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
                        {new Date(ticket.expectedCompletionDate).toLocaleDateString()}
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

export default ProjectTickets;
