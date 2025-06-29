package org.project.services;

import org.project.models.Invitation;
import org.project.repositories.InvitationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;

    public InvitationService(InvitationRepository invitationRepository) {
        this.invitationRepository = invitationRepository;
    }

    public Invitation createInvitation(Invitation invitation) {
        return invitationRepository.save(invitation);
    }

    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }

    public Invitation getInvitationById(String id) {
        return invitationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found with ID: " + id));
    }

    public List<Invitation> getInvitationsByProjectId(String projectId) {
        return invitationRepository.findByProjectId(projectId);
    }

    public Invitation updateInvitation(String id, Invitation newInvitation) {
        Invitation existing = getInvitationById(id);
        existing.setEmail(newInvitation.getEmail());
        existing.setProjectId(newInvitation.getProjectId());
        existing.setStatus(newInvitation.getStatus());
        return invitationRepository.save(existing);
    }

    public void deleteInvitation(String id) {
        if (!invitationRepository.existsById(id)) {
            throw new IllegalArgumentException("Invitation not found with ID: " + id);
        }
        invitationRepository.deleteById(id);
    }

    public Invitation getByProjectIdAndEmail(String projectId, String email) {
        return invitationRepository.findByProjectIdAndEmail(projectId, email).orElse(null);
    }
}
