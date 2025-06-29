package org.project.requests;

import lombok.Data;

@Data
public class TaskAssignmentEmailRequest {
    private String toEmail;
    private String taskTitle;
}
