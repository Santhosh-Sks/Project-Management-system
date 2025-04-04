import React, { useMemo } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Task, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TaskBoardProps {
  tasks: Task[] | null;
  onTaskClick?: (taskId: string) => void;
  onAssignTask?: (taskId: string, member: string) => void;
  onSendTask?: (status: TaskStatus) => void;
  className?: string;
  onDeleteTask?: (taskId: string) => Promise<void>; // Added onDeleteTask
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskClick,
  onAssignTask,
  onSendTask,
  className,
  onDeleteTask, // Destructure onDeleteTask
}) => {
  const safeTasks: Task[] = Array.isArray(tasks) ? tasks : [];

  const tasksByStatus = useMemo(() => {
    return safeTasks.reduce<Record<TaskStatus, Task[]>>(
      (acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      },
      { todo: [], "in-progress": [], done: [] }
    );
  }, [safeTasks]);

  const columns: { id: TaskStatus; title: string }[] = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 w-full", className)}>
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm capitalize">
              {column.title} ({tasksByStatus[column.id].length})
            </h3>
            {onSendTask && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => onSendTask(column.id)}
                aria-label={`Send task to ${column.title}`}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex-1 rounded-lg border p-3 overflow-y-auto min-h-[120px]">
          {tasksByStatus[column.id].length > 0 ? (
  tasksByStatus[column.id].map((task) => (
    <div key={task.id} className="relative">
      <TaskCard
        task={task}
        onClick={onTaskClick ? () => onTaskClick(task.id) : undefined}
        onAssign={(member) => onAssignTask?.(task.id, member)}
      />{onDeleteTask && (
        <Button
          variant="ghost"
          className="mt-9 absolute top-2 right-2"
          onClick={() => onDeleteTask(task.id)}
          aria-label="Delete task"
        >
          <TrashIcon className="h-5 w-5 text-red-500" />
        </Button>
      )}
      
    </div>
    
    
  ))
) : (
  <div className="h-full flex items-center justify-center text-muted-foreground text-sm p-6">
    <span className="italic">No tasks in this column</span>
  </div>
)}

          </div>
        </div>
      ))}
    </div>
  );
};
