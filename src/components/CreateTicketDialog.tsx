import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockProjects, mockUsers } from "@/lib/mockData";
import { fetchProject } from "@/services/project";
import { createTicket } from "@/services/ticket";
import { fetchUser } from "@/services/user";
import Loading from "./ui/loading";

export const CreateTicketDialog = ({ setOpen, open }: any) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    priority: "low",
    expectedDate: "",
    assignee: "",
    category: "task",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    replaceIndex?: number
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    if (replaceIndex !== undefined) {
      setImages((prev) =>
        prev.map((img, idx) => (idx === replaceIndex ? newPreviews[0] : img))
      );
      setFiles((prev) =>
        prev.map((f, idx) => (idx === replaceIndex ? newFiles[0] : f))
      );
    } else {
      setImages((prev) => [...prev, ...newPreviews]);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();

      // append each field from state
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // append files separately
      files.forEach((file) => formData.append("files", file));
      await createTicket(formData);

      toast({
        title: "Ticket Created Successfully",
        description: `Your ticket has been created successfully.`,
      });

      // Reset
      setForm({
        title: "",
        description: "",
        project: "",
        priority: "low",
        expectedDate: "",
        assignee: "",
        category: "task",
      });
      setFiles([]);
      setImages([]);
      setOpen(false)
    } catch (error: any) {
      toast({
        title: "Error Creating Ticket",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [projectData, userData] = await Promise.all([
        fetchProject(),
        fetchUser()
      ])
      setUsers(userData.data);
      setProjects(projectData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new support ticket
          </DialogDescription>
        </DialogHeader>

        {
          isLoading && <Loading />
        }

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              required
            />
          </div>

          {/* PROJECT */}
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select
              value={form.project}
              onValueChange={(v) => handleChange("project", v)}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PRIORITY, LEVEL, STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => handleChange("priority", v)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select ticket category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ASSIGNEE */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee *</Label>
            <Select
              value={form.assignee}
              onValueChange={(v) => handleChange("assignee", v)}
            >
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: any) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DATE */}
          <div className="space-y-2">
            <Label htmlFor="expectedDate">Expected Completion Date *</Label>
            <Input
              id="expectedDate"
              type="date"
              value={form.expectedDate}
              onChange={(e) => handleChange("expectedDate", e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* FILE UPLOAD PREVIEW */}
          <div className="space-y-2">
            <Label htmlFor="expectedDate">Attachment</Label>
            <div className="flex gap-4 flex-wrap">
              {images.map((src, index) => (
                <div key={index} className="relative w-16 h-16">
                  <label className="cursor-pointer block w-full h-full">
                    <img
                      src={src}
                      alt={`Uploaded ${index}`}
                      className="w-full h-full rounded-lg object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, index)}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImages((prev) => prev.filter((_, i) => i !== index));
                      setFiles((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
                <Plus className="w-6 h-6 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileChange(e)}
                />
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled=
              {
                isLoading ||
                !form.title ||
                !form.description ||
                !form.project ||
                !form.priority ||
                !form.expectedDate ||
                !form.assignee ||
                !form.category
              }>
              Create Ticket
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
