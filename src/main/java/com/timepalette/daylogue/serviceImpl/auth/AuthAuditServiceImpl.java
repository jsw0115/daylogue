package com.timepalette.daylogue.serviceImpl.auth;

import com.timepalette.daylogue.model.entity.auth.AuthAuditLog;
import com.timepalette.daylogue.model.enums.auth.AuthAuditEvent;
import com.timepalette.daylogue.repository.auth.AuthAuditLogRepository;
import com.timepalette.daylogue.service.auth.AuthAuditService;
//import com.timepalette.daylogue.shared.ids.UlidGenerator;
import com.timepalette.daylogue.support.UlidGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class AuthAuditServiceImpl implements AuthAuditService {

    private final AuthAuditLogRepository auditRepo;
    private final UlidGenerator ulid;

    public AuthAuditServiceImpl(AuthAuditLogRepository auditRepo, UlidGenerator ulid) {
        this.auditRepo = Objects.requireNonNull(auditRepo);
        this.ulid = Objects.requireNonNull(ulid);
    }

    /**
     * 감사 로그 기록(민감정보 원문 저장 금지)
     * @since 2025.12.28
     * @param userId
     * @param evt
     * @param ip
     * @param ua
     * @param metaJson
     * @return void
     * */
    @Override
    @Transactional(transactionManager = "authTxManager")
    public void write(String userId, AuthAuditEvent evt, String ip, String ua, String metaJson) {

        AuthAuditLog log = new AuthAuditLog();
        log.setId(ulid.newUlid());
        log.setUserId(userId);
        log.setEvt(evt);
        log.setIp(ip);
        log.setUa(trimUa(ua));
        log.setMetaJson(metaJson); // 토큰/비번 원문 절대 금지
        auditRepo.save(log);
    }

    private String trimUa(String ua) {
        if (ua == null) return null;
        return ua.length() > 255 ? ua.substring(0, 255) : ua;
    }
}
