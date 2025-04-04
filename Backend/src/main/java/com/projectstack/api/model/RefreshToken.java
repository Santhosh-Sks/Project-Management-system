package com.projectstack.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.Date;

@Document(collection = "refresh_tokens")
public class RefreshToken {

    @Id
    private String id;

    private String token;
    private String userId;
    private Date expiryDate;
    private User user;


    public void setUser(User user) {

        this.user = user;

    }
    @ManyToOne
@JoinColumn(name = "user_id", nullable = false)
    public User getUser() {

        return user;

    }

    public RefreshToken() {}

    public RefreshToken(String token, String userId, Date expiryDate) {
        this.token = token;
        this.userId = userId;
        
        this.expiryDate = expiryDate;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Date getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }
}
