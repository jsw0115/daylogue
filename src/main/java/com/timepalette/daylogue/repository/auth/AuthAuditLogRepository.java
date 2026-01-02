package com.timepalette.daylogue.repository.auth;

import com.timepalette.daylogue.model.entity.auth.AuthAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthAuditLogRepository extends JpaRepository<AuthAuditLog, String> {
}
