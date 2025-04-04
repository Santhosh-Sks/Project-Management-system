import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectTasks } from "@/components/projects/ProjectTasks";
import { ProjectMembers } from "@/components/projects/ProjectMembers";
import { ProjectChat } from "@/components/projects/ProjectChat";
import { ProjectFiles } from "@/components/projects/ProjectFiles";

// Import services
import { fetchProjectById, deleteProject } from "@/services/projectService";
import { fetchProjectTasks, createTask } from "@/services/taskService";
import { fetchTaskComments, createComment } from "@/services/commentService";
import { fetchProjectChat, sendChatMessage } from "@/services/chatService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [user, setUser] = useState({ name: "Guest", email: "" });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser({ name: parsedUser.name || "Guest", email: parsedUser.email || "" });
      }
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
    }
  }, []);

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id || ""),
    enabled: !!id,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["projectTasks", id],
    queryFn: () => fetchProjectTasks(id || ""),
    enabled: !!id,
  });

  const { data: chatMessages = [] } = useQuery({
    queryKey: ["projectChat", id],
    queryFn: () => fetchProjectChat(id || ""),
    enabled: !!id,
  });

  const { data: comments = {} } = useQuery({
    queryKey: selectedTask?.id ? ["taskComments", id, selectedTask?.id] : null,
    queryFn: () => fetchTaskComments(id || "", selectedTask?.id || ""),
    enabled: !!id && !!selectedTask?.id,
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData: Partial<Task>) => createTask(id || "", taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", id] });
      toast({ title: "Task Created", description: "Task added successfully." });
      setNewTaskTitle("");
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      toast({ title: "Project Deleted", description: "Project removed successfully." });
      navigate("/dashboard");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => sendChatMessage(id || "", message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectChat", id] });
      setNewMessage("");
    },
  });

  const handleDeleteProject = () => {
    if (id) deleteProjectMutation.mutate(id);
  };

  const handleAddTask = () => {
    if (newTaskTitle) createTaskMutation.mutate({ title: newTaskTitle });
  };

  const handleAddComment = () => {
    if (!selectedTask?.id) return;
    createComment(id || "", selectedTask.id, newComment)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["taskComments", id, selectedTask.id] });
        setNewComment("");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to add comment.",
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <Navbar user={user} />
      <PageContainer>
        <ProjectHeader
          project={project}
          onInviteClick={() => setShowInviteDialog(true)}
          onProjectUpdate={() => queryClient.invalidateQueries({ queryKey: ["project", id] })}
        />

        <Tabs defaultValue="tasks" className="mt-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
          <ProjectTasks
            projectId={id || ""}
            tasks={tasks || []}  
            comments={comments || {}}
            onTaskClick={(task: Task) => {
              setSelectedTask(task);
            }}
            selectedTask={selectedTask}
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            onAddTask={handleAddTask}
          />

          </TabsContent>

          <TabsContent value="members">
            {isProjectLoading ? <p>Loading project...</p> : <ProjectMembers members={project?.members ?? []} onInviteClick={() => setShowInviteDialog(true)} />}
          </TabsContent>

          <TabsContent value="chat">
            <ProjectChat
              chatMessages={chatMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={() => sendMessageMutation.mutate(newMessage)}
              currentUserId={user.email}
            />
          </TabsContent>

          <TabsContent value="files">
            <ProjectFiles />
          </TabsContent>
        </Tabs>

        <Button variant="destructive" onClick={handleDeleteProject} className="mt-4">
          Delete Project
        </Button>
      </PageContainer>
    </>
  );
};

export default ProjectDetails;
