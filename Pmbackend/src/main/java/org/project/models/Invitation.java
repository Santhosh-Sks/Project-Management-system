package org.project.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "invite")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Invitation {
    @Id
    private String id;
    @NotNull
    @Email
    private String email;

    @NotBlank
    private String projectId;

    private InvitationStatus status;

}
