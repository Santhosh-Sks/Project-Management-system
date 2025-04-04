package com.projectstack.api.service;

import com.projectstack.api.model.RefreshToken;
import com.projectstack.api.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refreshExpirationMs}")  // ✅ Set in application.properties
    private long refreshTokenDurationMs;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshToken createRefreshToken(String userId) {
        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID().toString(),  // ✅ Generate unique token
                userId,
                Date.from(Instant.now().plusMillis(refreshTokenDurationMs))  // ✅ Set expiry
        );
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> getRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public boolean isTokenValid(String token) {
        Optional<RefreshToken> storedToken = refreshTokenRepository.findByToken(token);
        return storedToken.isPresent() && storedToken.get().getExpiryDate().after(new Date());
    }


    public void deleteRefreshTokenByUserId(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}
