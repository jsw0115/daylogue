package com.timepalette.daylogue.repository.auth;

import com.timepalette.daylogue.model.entity.auth.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByTokHash(String tokHash);
}
