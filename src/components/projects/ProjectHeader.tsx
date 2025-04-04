import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon, UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Project } from '@/lib/types';
import { cn } from "@/lib/utils";
import axios from 'axios';

interface ProjectHeaderProps {
  project: Project | null;
  onProjectUpdate: (updatedProject: Project) => void;
  onInviteClick: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project,
  onProjectUpdate
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(project);
  const [inviteEmails, setInviteEmails] = useState<string>("");

  if (!project) return <div>Loading...</div>;

  const API_URL = "http://localhost:8080/api";

  const getStatusColor = (status?: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  const handleEditProject = async () => {
    if (!editedProject) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/projects/${project.id}`, editedProject, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      onProjectUpdate(response.data);
      setIsEditOpen(false);
      toast({ title: "Project Updated", description: "Your project details have been updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update project.", variant: "destructive" });
    }
  };

  const handleInviteMembers = async () => {
    if (!inviteEmails) return;
    const emailList = inviteEmails.split(',').map(email => email.trim());

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/projects/${project.id}/invites`, { emails: emailList, role: "member" }, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      setIsInviteOpen(false);
      toast({ title: "Invites Sent", description: "Invitations have been sent successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send invitations.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button variant="ghost" size="sm" className="w-fit -ml-2 mb-2" asChild>
        <Link to="/dashboard">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge className={cn("mb-2", getStatusColor(project.status))}>
            {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : "Unknown"}
          </Badge>
          <h1 className="text-3xl font-bold">{project.name || "Untitled Project"}</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            {project.description || "No description available."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
          <Button variant="outline" onClick={() => setIsInviteOpen(true)}>
            Invite Members
          </Button>
          <Button onClick={() => setIsEditOpen(true)}>Edit Project</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-2">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Created:</span>
          <span>{formatDate(project.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Team:</span>
          <span>{project.members?.length || 0} members</span>
        </div>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Project Name"
            value={editedProject?.name || ""}
            onChange={(e) => setEditedProject(prev => prev ? { ...prev, name: e.target.value } : prev)}
          />
          <Textarea
            placeholder="Project Description"
            value={editedProject?.description || ""}
            onChange={(e) => setEditedProject(prev => prev ? { ...prev, description: e.target.value } : prev)}
          />
          <DialogFooter>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Members Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter emails, separated by commas"
            value={inviteEmails}
            onChange={(e) => setInviteEmails(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleInviteMembers}>Send Invites</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
