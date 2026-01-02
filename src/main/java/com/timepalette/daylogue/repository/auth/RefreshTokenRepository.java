package com.timepalette.daylogue.repository.auth;

import com.timepalette.daylogue.model.entity.auth.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    Optional<RefreshToken> findByTokHash(String tokHash);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update RefreshToken rt
           set rt.revUtc = :revUtc
         where rt.userId = :userId
           and rt.revUtc is null
    """)
    int revokeAllActiveByUserId(@Param("userId") String userId, @Param("revUtc") LocalDateTime revUtc);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update RefreshToken rt
           set rt.revUtc = :revUtc
         where rt.tokHash = :tokHash
           and rt.revUtc is null
    """)
    int revokeByTokHash(@Param("tokHash") String tokHash, @Param("revUtc") LocalDateTime revUtc);
}
