package org.project.services;

import lombok.RequiredArgsConstructor;
import org.project.models.Task;
import org.project.models.User;
import org.project.repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final UserService userService;

    private final ProjectService projectService;

    private final TaskRepository taskRepository;

    // Create a new task
    public Task createTask(Task task) {
        task.setCreatedAt(new Date());
        task.setUpdatedAt(new Date());

        if (task.getAssignedTo() == null || task.getAssignedTo().isEmpty()) {
            throw new IllegalArgumentException("Assigned user ID is required.");
        }

        Task savedTask = taskRepository.save(task);

        // Add the task to the project's task list
        projectService.addTask(task.getProjectId(), savedTask.getId());

        return savedTask;
    }


    // Get task by ID
    public Task getTaskById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Update a task
    public Task updateTask(String id, Task updatedTask) {
        Task existingTask = getTaskById(id);

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setStatus(updatedTask.getStatus());
        existingTask.setAssignedTo(updatedTask.getAssignedTo());
        existingTask.setComments(updatedTask.getComments());
        existingTask.setUpdatedAt(new Date());

        return taskRepository.save(existingTask);
    }

    // Delete a task
    public void deleteTask(String id) {
        if (!taskRepository.existsById(id)) {
            throw new IllegalArgumentException("Task not found with ID: " + id);
        }
        taskRepository.deleteById(id);
    }

    // Get tasks by projectId (assuming projectId is stored in task, add this field if needed)
    public List<Task> getTasksByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId);
    }
}
