package org.project.controllers;

import org.project.models.Invitation;
import org.project.models.InvitationStatus;
import org.project.models.JwtUtil;
import org.project.services.EmailService;
import org.project.services.InvitationService;
import org.project.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    private final InvitationService invitationService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final ProjectService projectService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Autowired
    public InvitationController(
            InvitationService invitationService,
            EmailService emailService,
            JwtUtil jwtUtil,
            ProjectService projectService
    ) {
        this.invitationService = invitationService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Invitation>> getAllInvitations() {
        return ResponseEntity.ok(invitationService.getAllInvitations());
    }

    @PostMapping
    public ResponseEntity<?> createInvitation(@Valid @RequestBody Invitation invitation) {
        Invitation existing = invitationService.getByProjectIdAndEmail(invitation.getProjectId(), invitation.getEmail());
        if (existing != null && existing.getStatus() == InvitationStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Already invited with pending status.");
        }

        Invitation created = invitationService.createInvitation(invitation);

        String link = baseUrl + "/api/invitations/accept?projectId=" + invitation.getProjectId()
                + "&email=" + invitation.getEmail();
        String subject = "You're Invited to Join a Project";
        String message = String.format("Hi,\n\nYou've been invited to a project.\nClick to accept:\n%s", link);

        emailService.sendEmail(invitation.getEmail(), subject, message);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptInvitationViaLink(
            @RequestParam String projectId,
            @RequestParam String email,
            @RequestHeader("Authorization") String token
    ) {
        try {
            String jwt = token.replace("Bearer ", "");
            String loggedInEmail = jwtUtil.extractUsername(jwt);

            if (!email.equalsIgnoreCase(loggedInEmail)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token does not match invited email.");
            }

            Invitation invitation = invitationService.getByProjectIdAndEmail(projectId, email);
            if (invitation == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No invitation found for this project and email.");
            }

            if (invitation.getStatus() != InvitationStatus.PENDING) {
                return ResponseEntity.badRequest().body("Invitation already processed.");
            }

            boolean added = projectService.addMemberByEmail(projectId, email);
            if (!added) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to add member to project.");
            }

            invitation.setStatus(InvitationStatus.ACCEPTED);
            invitationService.updateInvitation(invitation.getId(), invitation);

            return ResponseEntity.ok("Invitation accepted and user added.");
        } catch (Exception e) {
            e.printStackTrace(); // or use logger
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Invitation> getInvitationById(@PathVariable String id) {
        Invitation invitation = invitationService.getInvitationById(id);
        return invitation != null ?
                ResponseEntity.ok(invitation) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Invitation>> getInvitationsByProjectId(@PathVariable String projectId) {
        return ResponseEntity.ok(invitationService.getInvitationsByProjectId(projectId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invitation> updateInvitation(@PathVariable String id, @Valid @RequestBody Invitation invitation) {
        return ResponseEntity.ok(invitationService.updateInvitation(id, invitation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvitation(@PathVariable String id) {
        invitationService.deleteInvitation(id);
        return ResponseEntity.noContent().build();
    }
}
