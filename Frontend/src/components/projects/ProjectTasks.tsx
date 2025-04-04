import React, { useState, useEffect, useCallback } from "react";
import { PlusIcon, TrashIcon } from "lucide-react"; // Import TrashIcon
import { Button } from "@/components/ui/button";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { Task, TaskStatus, Comment } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

interface ProjectTasksProps {
  projectId: string;
  onTaskClick: (task: Task) => void;
  selectedTask: Task | null;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: () => void;
  comments: any;
  tasks: Task[];
  onAddTask: () => void;
}

export const ProjectTasks: React.FC<ProjectTasksProps> = ({
  projectId,
  onTaskClick,
  selectedTask,
  newComment,
  setNewComment,
  handleAddComment,
}) => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/projects/${projectId}/tasks`
        );
        setTaskList(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  const fetchComments = useCallback(async () => {
    if (!selectedTask || !projectId) return;

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User might be logged out.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/projects/${projectId}/tasks/${selectedTask.id}/comments`, // Correct API path
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched comments:", response.data);
      setComments((prev) => ({ ...prev, [selectedTask.id]: response.data }));
    } catch (error: any) {
      console.error("Error fetching comments:", error.response?.data || error.message);
    }
  }, [selectedTask?.id, projectId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    setTaskData({ title: "", description: "" });
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/projects/${projectId}/tasks/${taskId}`);
      setTaskList((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = async () => {
    if (!taskData.title.trim() || !taskData.description.trim()) {
      alert("Please enter task details!");
      return;
    }

    try {
      const newTask = {
        title: taskData.title,
        description: taskData.description,
        status: "todo",
        priority: "medium",
        tags: [],
      };

      const { data } = await axios.post(
        `http://localhost:8080/api/projects/${projectId}/tasks`,
        newTask
      );

      setTaskList((prevTasks) => [...prevTasks, data]);
      handleModalToggle();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Task Board</h2>
        <Button onClick={handleModalToggle}>
          <PlusIcon className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
            <input
              type="text"
              placeholder="Task Title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="border rounded-md p-2 w-full mb-3"
            />
            <textarea
              placeholder="Task Description"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              className="border rounded-md p-2 w-full mb-3"
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={handleModalToggle} className="bg-gray-300 text-black">
                Cancel
              </Button>
              <Button onClick={handleAddTask} className="bg-blue-600 text-white">
                Create Task
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <TaskBoard
            tasks={taskList}
            onTaskClick={(taskId) => {
              const task = taskList.find((t) => t.id === taskId);
              if (task) onTaskClick(task);
            }}
            onDeleteTask={deleteTask} 
          />
        </div>

        {selectedTask && (
          <div className="bg-accent/30 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">{selectedTask.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedTask.description}</p>
            <div className="flex items-center mb-4">
              <Badge>{selectedTask.priority}</Badge>
              <Badge className="ml-2">{selectedTask.status}</Badge>
            </div>
            <h4 className="text-sm font-medium mb-2">Comments</h4>
            <div className="max-h-[300px] overflow-y-auto mb-4">
              {comments[selectedTask.id]?.map((comment) => (
                <div key={comment.id} className="mb-3 pb-3 border-b">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.author?.avatar} alt={comment.author?.name} />
                      <AvatarFallback>{comment.author?.name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{comment.author?.name || "Unknown"}</span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              )) || <p className="text-sm text-muted-foreground">No comments yet</p>}
            </div>
            <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="min-h-[80px]" />
            <Button className="mt-2" disabled={!newComment.trim()} onClick={handleAddComment}>Send </Button>
          </div>
        )}
      </div>
    </div>
  );
};
