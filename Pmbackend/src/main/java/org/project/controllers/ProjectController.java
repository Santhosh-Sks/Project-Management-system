package org.project.controllers;

import lombok.RequiredArgsConstructor;
import org.project.models.Project;
import org.project.services.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project project) {
        Project updatedProject = projectService.updateProject(id, project);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{id}/add-member")
    public ResponseEntity<String> addMemberToProject(@PathVariable String id, @RequestParam String memberId) {
        boolean success = projectService.addMemberByEmail(id, memberId);
        if(success) {
            return ResponseEntity.ok("Member added successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found.");
        }
    }


    @PostMapping("/{id}/add-task")
    public ResponseEntity<Project> addTaskToProject(@PathVariable String id, @RequestParam String taskId) {
        Project updatedProject = projectService.addTask(id, taskId);
        return ResponseEntity.ok(updatedProject);
    }

}
