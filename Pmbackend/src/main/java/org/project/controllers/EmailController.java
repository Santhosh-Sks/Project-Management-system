package org.project.controllers;

import org.project.requests.InvitationEmailRequest;
import org.project.requests.TaskAssignmentEmailRequest;
import org.project.services.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/invitation")
    public ResponseEntity<Map<String, String>> sendInvitationEmail(@RequestBody InvitationEmailRequest request) {
        emailService.sendInvitationEmail(request.getToEmail(), request.getProjectId());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Invitation email sent successfully to " + request.getToEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/task-assignment")
    public ResponseEntity<Map<String, String>> sendTaskAssignmentEmail(@RequestBody TaskAssignmentEmailRequest request) {
        emailService.sendTaskAssignmentEmail(request.getToEmail(), request.getTaskTitle());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Task assignment email sent successfully to " + request.getToEmail());
        return ResponseEntity.ok(response);
    }
}
