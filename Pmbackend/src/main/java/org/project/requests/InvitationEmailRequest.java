package org.project.requests;

import lombok.Data;

@Data
public class InvitationEmailRequest {
    private String toEmail;
    private String projectId;
}
