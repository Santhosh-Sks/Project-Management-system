package com.projectstack.api.service;

import com.projectstack.api.payload.request.SignupRequest;
import com.projectstack.api.payload.request.LoginRequest;
import com.projectstack.api.payload.response.JwtResponse;
import com.projectstack.api.model.User;

public interface AuthService {

    User registerUser(SignupRequest signupRequest);

    JwtResponse authenticateUser(LoginRequest loginRequest);

    void logoutUser(String refreshToken);

    String generateRefreshToken(User user);

    boolean validateRefreshToken(String token);
}