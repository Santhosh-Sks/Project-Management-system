package com.projectstack.api.service.impl;

import com.projectstack.api.service.AuthService;
import com.projectstack.api.payload.request.SignupRequest;
import com.projectstack.api.payload.request.LoginRequest; // Update this path if LoginRequest is in a different package
import com.projectstack.api.payload.response.JwtResponse;
import com.projectstack.api.model.User;
import com.projectstack.api.model.RefreshToken;
import com.projectstack.api.repository.UserRepository;
import com.projectstack.api.repository.RefreshTokenRepository;
import com.projectstack.api.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.util.Date;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Override
    public User registerUser(SignupRequest signupRequest) {
        if (signupRequest == null || signupRequest.getEmail() == null || signupRequest.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(encoder.encode(signupRequest.getPassword()));
        user.setRoles(signupRequest.getRoles());

        return userRepository.save(user);
    }

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        if (loginRequest == null || loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            logger.error("Invalid login request: missing required fields");
            throw new IllegalArgumentException("Email and password are required");
        }

        logger.info("Authentication attempt for user: {}", loginRequest.getEmail());

        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + loginRequest.getEmail());
        }

        User user = userOptional.get();
        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
            user.getEmail(), 
            null, 
            user.getRoles().stream()
                .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(role))
                .toList()
        );
        String accessToken = jwtTokenProvider.generateToken(authentication);
        String refreshToken = generateRefreshToken(user);

        return new JwtResponse(user.getId(), user.getName(), user.getEmail(), accessToken, refreshToken, null);
    }

    @Override
    public void logoutUser(String refreshToken) {
        logger.info("Logging out user with refresh token: {}", refreshToken);

        // Invalidate the current refresh token
        refreshTokenRepository.deleteByToken(refreshToken);

        logger.info("Refresh token invalidated successfully");
    }

    public String generateRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user); // Associate the User object with the RefreshToken
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Date.from(Instant.now().plus(30, ChronoUnit.DAYS))); // Set expiry date
    
        refreshTokenRepository.save(refreshToken); // Save the RefreshToken to the repository
        return refreshToken.getToken();
    }

    public boolean validateRefreshToken(String token) {
        Optional<RefreshToken> refreshTokenOptional = refreshTokenRepository.findByToken(token);
        if (refreshTokenOptional.isEmpty()) {
            return false;
        }

        RefreshToken refreshToken = refreshTokenOptional.get();
        if (refreshToken.getExpiryDate().toInstant().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            return false;
        }

        return true;
    }
}