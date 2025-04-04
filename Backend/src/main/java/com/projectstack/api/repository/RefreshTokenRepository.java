
package com.projectstack.api.repository;



import com.projectstack.api.model.RefreshToken;

import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Repository;



import java.util.Optional;



@Repository

public interface RefreshTokenRepository extends MongoRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

        void deleteByToken(String userId);
        void deleteByUserId(String userId);
    }