package org.project.repositories;

import org.project.models.Invitation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends MongoRepository<Invitation, String> {
    Optional<Invitation> findByProjectIdAndEmail(String projectId, String email);
    List<Invitation> findByProjectId(String projectId);
}
