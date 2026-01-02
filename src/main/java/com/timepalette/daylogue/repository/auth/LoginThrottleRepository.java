package com.timepalette.daylogue.repository.auth;

import com.timepalette.daylogue.model.entity.auth.LoginThrottle;
import com.timepalette.daylogue.model.enums.auth.ThrottleKeyType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LoginThrottleRepository extends JpaRepository<LoginThrottle, String>  {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select lt from LoginThrottle lt
         where lt.keyType = :keyType
           and lt.keyVal  = :keyVal
    """)
    Optional<LoginThrottle> findForUpdate(@Param("keyType") ThrottleKeyType keyType, @Param("keyVal") String keyVal);
}
