package org.project.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "task")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    private String id;
    @NotBlank(message = "Title is mandatory")
    private String title;
    private String projectId;
    private String description;
    private String status;
    private String assignedTo;
    private List<String> comments;
    private Date createdAt;
    private Date updatedAt;
}