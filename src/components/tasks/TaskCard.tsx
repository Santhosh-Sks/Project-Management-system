import React, { useCallback } from 'react';
import { CalendarIcon, ChevronRightIcon, UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Task } from '@/lib/types';
import { cn, getPriorityColor, formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
  onAssign?: (member: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, className }) => {
  const navigate = useNavigate();

  const handleNavigation = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/tasks/${task.id}`);
    }
  }, [onClick, navigate, task.id]);

  return (
    <div 
      className={cn(
        "task-card group hover:border-primary/50 cursor-pointer",
        className
      )}
      onClick={handleNavigation}
    >
      {/* Task Title & Priority */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
          {task.title}
        </h4>
        {task.priority && (
          <Badge 
            className={cn("px-2 text-xs font-normal", getPriorityColor(task.priority))}
          >
            {task.priority}
          </Badge>
        )}
      </div>
      
      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* Assignee & Due Date */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4">
          {task.assignee ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {task.assignee.avatar ? (
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      ) : (
                        <AvatarFallback>{task.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {task.assignee.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assigned to {task.assignee.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserIcon className="h-3 w-3" />
              <span>Unassigned</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <ChevronRightIcon 
          className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" 
        />
      </div>

      {/* Task Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
          {task.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-secondary/50">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
