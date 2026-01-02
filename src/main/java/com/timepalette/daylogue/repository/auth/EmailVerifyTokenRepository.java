package com.timepalette.daylogue.repository.auth;

import com.timepalette.daylogue.model.entity.auth.EmailVerifyToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerifyTokenRepository extends JpaRepository<EmailVerifyToken, String> {

    Optional<EmailVerifyToken> findByTokHash(String tokHash);
}
