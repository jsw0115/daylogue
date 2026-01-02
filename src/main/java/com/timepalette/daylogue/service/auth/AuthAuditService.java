package com.timepalette.daylogue.service.auth;

import com.timepalette.daylogue.model.enums.auth.AuthAuditEvent;

public interface AuthAuditService {

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
    public void write (String userId, AuthAuditEvent evt, String ip, String ua, String metaJson);
}
