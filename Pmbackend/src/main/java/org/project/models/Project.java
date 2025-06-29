package org.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "project")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    private String id;
    private String title;
    private String description;
    private String category;
    private List<String> technologies = new ArrayList<>();
    private String createdBy;
    private Date createdAt = new Date();
    private List<String> members = new ArrayList<>();
    private List<String> tasks = new ArrayList<>();
}
