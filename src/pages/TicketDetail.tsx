import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useAuth } from "@/contexts/AuthContext";
import { TicketStatus, SupportLevel } from "@/types/ticket";
import { ArrowLeft, Clock, User, Calendar, Paperclip } from "lucide-react";
import { ErrorDialog } from "@/components/ErrorDialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { fetchTicketById, updateTicketStatus } from "@/services/ticket";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loading from "@/components/ui/loading";
import { BASE_URL } from "@/lib/constants/env";
import CategoryBadge from "@/components/CategoryBadge";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [ticketLogs, setTicketLogs] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [errorDialog, setErrorDialog] = useState({
    open: false,
    title: "",
    description: "",
  });

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  }), []);

  const handleAddComment = () => {
    if (!comment.trim() || comment === '<p><br></p>') return;

    if (!canEditTicket()) {
      setErrorDialog({
        open: true,
        title: "Access Denied",
        description: "You don't have permission to add comments to this ticket.",
      });
      return;
    }

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the ticket",
    });
    setComment("");
  };

  const fetchTicketDetail = async () => {
    try {
      setLoading(true)
      const result = await fetchTicketById(id);
      setTicket(result.data);
      setTicketLogs(result.data.ticketLogs || []);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  // const editor = useEditor({
  //   extensions: [StarterKit, Bold, Underline, Italic],
  //   content: "",
  //   editorProps: {
  //     attributes: {
  //       class:
  //         "min-h-[120px] border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm",
  //     },
  //   },
  // });

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: TicketStatus) => {
    try {
      setLoading(true)
      await updateTicketStatus(ticket._id, newStatus);
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error(error);
      setErrorDialog({
        open: true,
        title: "Error",
        description: error?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false)
    }
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

  // const handleAddLog = () => {
  //   const htmlContent = editor?.getHTML() || "";
  //   if (!htmlContent.trim() || htmlContent === "<p></p>") return;

  //   if (!user) {
  //     setErrorDialog({
  //       open: true,
  //       title: "Access Denied",
  //       description: "You don't have permission to add comments to this ticket.",
  //     });
  //     return;
  //   }

  //   const newLog = {
  //     action: "Comment Added",
  //     performedBy: { name: user.name },
  //     comment: htmlContent,
  //     createdAt: new Date().toISOString(),
  //   };

  //   setTicketLogs((prev) => [newLog, ...prev]);

  //   toast({
  //     title: "Comment Added",
  //     description: "Your comment has been added to the log.",
  //   });

  //   editor?.commands.clearContent();
  // };

  const canEditTicket = () => !!user;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          {/* Left side: Details + Comment */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryBadge category={ticket.category} />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {ticket.level && (
                          <span className="text-sm font-semibold px-2 py-1 bg-primary/10 text-primary rounded">
                            {ticket.level}
                          </span>
                        )}
                      </div>
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
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-sm">
                    <div className="text-muted-foreground">Project</div>
                    <div className="font-medium">{ticket.project?.name}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Created by</div>
                      <div className="font-medium">{ticket.reporter?.name}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Assigned to</div>
                    <div className="font-medium">
                      {ticket.assignee?.name || "Unassigned"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">
                        Expected completion
                      </div>
                      <div className="font-medium">
                        {ticket.expectedDate
                          ? format(new Date(ticket.expectedDate), "MMM dd, yyyy")
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {ticket.attachments?.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Paperclip className="h-4 w-4" /> Attachments
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {ticket.attachments.map((file, index) => (
                        <div key={index} className="space-y-1">
                          {file.mimetype.startsWith("image/") ? (
                            <img
                              src={`${BASE_URL}${file.url}`}
                              alt={file.filename}
                              className="w-32 h-32 object-cover rounded-md border"
                            />
                          ) : (
                            <a
                              href={`${BASE_URL}${file.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {file.filename}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Comment</Label>
                  <div className="bg-background border rounded-md">
                    <ReactQuill
                      theme="snow"
                      value={comment}
                      onChange={setComment}
                      modules={quillModules}
                      placeholder="Write your comment here..."
                      className="h-48"
                    />
                  </div>
                  <div className="pt-14">
                    <Button
                      onClick={handleAddComment}
                      disabled={!comment.trim() || comment === '<p><br></p>'}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </CardContent>

              {/* Existing Comments */}
              {ticket.comments.length > 0 && (
                <div className="space-y-4 pb-4 border-b">
                  {ticket.comments.map((ticketComment) => (
                    <div key={ticketComment.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm">{ticketComment.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(ticketComment.createdAt, "MMM dd, yyyy 'at' HH:mm")}
                        </span>
                      </div>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: ticketComment.content }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar: Actions + Logs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <Select
                    defaultValue={ticket.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="attending">Attending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  {
                    ticket.level == "L1" &&
                    <Button onClick={() => handleEscalate("L2")} variant="outline" size="sm">
                      Escalate to L2
                    </Button>
                  }
                  {
                    ticket.level == "L2" &&
                    <Button onClick={() => handleEscalate("L3")} variant="outline" size="sm">
                      Escalate to L3
                    </Button>
                  }
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                {ticketLogs.length ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {ticketLogs.map((log, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                          {index !== ticketLogs.length - 1 && (
                            <div className="w-px bg-border flex-1 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{log.action}</span>
                            <span className="text-xs text-muted-foreground">
                              by {log?.performedBy?.name || "-"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <Clock className="h-3 w-3" />
                            {format(new Date(log.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                          </div>
                          {log.note && (
                            <div
                              className="text-sm text-muted-foreground bg-muted p-3 rounded-md"
                              dangerouslySetInnerHTML={{ __html: log.note }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No logs yet for this ticket.
                  </p>
                )}
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
