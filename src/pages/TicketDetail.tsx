import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { mockTickets } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { TicketStatus, SupportLevel } from "@/types/ticket";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { ErrorDialog } from "@/components/ErrorDialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const ticket = mockTickets.find((t) => t.id === id);
  const [notes, setNotes] = useState("");
  const [errorDialog, setErrorDialog] = useState({ open: false, title: "", description: "" });

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
          <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!canEditTicket()) {
      setErrorDialog({
        open: true,
        title: "Access Denied",
        description: "You don't have permission to edit this ticket.",
      });
      return;
    }
    
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus}`,
    });
  };

  const handleEscalate = (level: SupportLevel) => {
    if (!canEditTicket()) {
      setErrorDialog({
        open: true,
        title: "Access Denied",
        description: "You don't have permission to escalate this ticket.",
      });
      return;
    }
    
    toast({
      title: "Ticket Escalated",
      description: `Ticket has been escalated to ${level}`,
    });
  };

  const handleAssignLevel = (level: SupportLevel) => {
    if (!canEditTicket()) {
      setErrorDialog({
        open: true,
        title: "Access Denied",
        description: "You don't have permission to assign support level.",
      });
      return;
    }
    
    toast({
      title: "Support Level Assigned",
      description: `Ticket assigned support level: ${level}`,
    });
  };

  const handleAddLog = () => {
    if (!notes.trim()) return;
    
    if (!canEditTicket()) {
      setErrorDialog({
        open: true,
        title: "Access Denied",
        description: "You don't have permission to add notes to this ticket.",
      });
      return;
    }
    
    toast({
      title: "Note Added",
      description: "Your note has been added to the ticket log",
    });
    setNotes("");
  };

  const canEditTicket = () => {
    // In a real app, this would check proper permissions
    // For now, all authenticated users can edit
    return !!user;
  };

  const canAssignLevel = () => {
    return !ticket.supportLevel;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-mono text-muted-foreground">{ticket.id}</span>
                      {ticket.supportLevel && (
                        <span className="text-sm font-semibold px-2 py-1 bg-primary/10 text-primary rounded">
                          {ticket.supportLevel}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                  </div>
                  <div className="flex flex-col gap-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Created by</div>
                      <div className="font-medium">{ticket.createdBy}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Expected completion</div>
                      <div className="font-medium">
                        {format(ticket.expectedCompletionDate, "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Category</div>
                      <div className="font-medium capitalize">{ticket.category}</div>
                    </div>
                  </div>
                  {ticket.assignedTo && (
                    <div className="flex items-center gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Assigned to</div>
                        <div className="font-medium">{ticket.assignedTo}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticket.logs.map((log, index) => (
                    <div key={log.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        {index !== ticket.logs.length - 1 && (
                          <div className="w-px bg-border flex-1 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{log.action}</span>
                          <span className="text-xs text-muted-foreground">by {log.performedBy}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <Clock className="h-3 w-3" />
                          {format(log.timestamp, "MMM dd, yyyy 'at' HH:mm")}
                        </div>
                        {log.notes && (
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <Select defaultValue={ticket.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {canAssignLevel() && (
                  <div className="space-y-2">
                    <Label>Assign Support Level</Label>
                    <Select onValueChange={handleAssignLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L1">L1 - Basic Support</SelectItem>
                        <SelectItem value="L2">L2 - Advanced Support</SelectItem>
                        <SelectItem value="L3">L3 - Expert Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Button onClick={() => handleEscalate("L2")} variant="outline" size="sm">
                    Escalate to L2
                  </Button>
                  <Button onClick={() => handleEscalate("L3")} variant="outline" size="sm">
                    Escalate to L3
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Label htmlFor="notes">Add Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleAddLog} className="w-full" disabled={!notes.trim()}>
                    Add to Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ErrorDialog
        open={errorDialog.open}
        onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}
        title={errorDialog.title}
        description={errorDialog.description}
      />
    </div>
  );
};

export default TicketDetail;
