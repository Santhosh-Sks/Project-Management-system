package org.project.services;

import lombok.RequiredArgsConstructor;
import org.project.models.Project;
import org.project.repositories.ProjectRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    // Create a new project
    public Project createProject(Project project) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        project.setCreatedBy(userEmail);

        return projectRepository.save(project);
    }

    // Get project by ID
    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + id));
    }

    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Update project
    public Project updateProject(String id, Project updatedProject) {
        Project existingProject = getProjectById(id);

        existingProject.setTitle(updatedProject.getTitle());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setTechnologies(updatedProject.getTechnologies());
        existingProject.setCategory(updatedProject.getCategory());
        existingProject.setCreatedBy(updatedProject.getCreatedBy());
        existingProject.setMembers(updatedProject.getMembers());
        existingProject.setTasks(updatedProject.getTasks());

        return projectRepository.save(existingProject);
    }

    // Delete project
    public void deleteProject(String id) {
        if (!projectRepository.existsById(id)) {
            throw new IllegalArgumentException("Project not found with ID: " + id);
        }
        projectRepository.deleteById(id);
    }

    // Get projects by user ID
    public List<Project> getProjectsByCreatedBy(String userId) {
        return projectRepository.findByCreatedBy(userId);
    }


    // Add member to project
    public boolean addMemberByEmail(String projectId, String email) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return false;

        if (project.getMembers() == null) {
            project.setMembers(new ArrayList<>());
        }

        if (!project.getMembers().contains(email)) {
            project.getMembers().add(email);
            projectRepository.save(project);
        }

        return true;
    }



    // Add task to project
    public Project addTask(String projectId, String taskId) {
        Project project = getProjectById(projectId);
        if (!project.getTasks().contains(taskId)) {
            project.getTasks().add(taskId);
            return projectRepository.save(project);
        }
        return project;
    }
}
