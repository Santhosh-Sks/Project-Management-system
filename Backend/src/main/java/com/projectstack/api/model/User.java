package com.projectstack.api.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;

    @NotBlank
    private String name;

    @Indexed(unique = true)
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private String phone;

    private String avatar;

    @Builder.Default
    private Set<String> roles = new HashSet<>();

    @Builder.Default
    private boolean verified = false;

    private String otp;

    private LocalDateTime otpExpiry;
}
