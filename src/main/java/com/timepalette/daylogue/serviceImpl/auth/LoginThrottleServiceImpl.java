package com.timepalette.daylogue.serviceImpl.auth;

import com.timepalette.daylogue.exception.AuthException;
import com.timepalette.daylogue.model.entity.auth.LoginThrottle;
import com.timepalette.daylogue.model.enums.auth.ThrottleKeyType;
import com.timepalette.daylogue.model.enums.common.AuthErrorCode;
import com.timepalette.daylogue.repository.auth.LoginThrottleRepository;
import com.timepalette.daylogue.service.auth.LoginThrottleService;

import com.timepalette.daylogue.support.DateTimeSupporter;
import com.timepalette.daylogue.support.UlidGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LoginThrottleServiceImpl implements LoginThrottleService {

    private static final int LOCK_THRESHOLD = 5;
    private static final int LOCK_MINUTES = 15;

    private final LoginThrottleRepository repo;
    private final UlidGenerator ulid;
    private final DateTimeSupporter dateTimeSupporter;

    public LoginThrottleServiceImpl(LoginThrottleRepository repo, UlidGenerator ulid, DateTimeSupporter dateTimeSupporter) {
        this.repo = repo;
        this.ulid = ulid;
        this.dateTimeSupporter = dateTimeSupporter;
    }

    /**
     * 잠금 여부 검사(잠금 상태면 예외)
     * @since 2025.12.28
     * @param keyType
     * @param keyVal
     * @return void
     */
    @Override
    @Transactional(transactionManager = "authTxManager")
    public void checkLockedOrThrow(ThrottleKeyType keyType, String keyVal) {

        LocalDateTime now = dateTimeSupporter.nowUtc();
        repo.findForUpdate(keyType, keyVal).ifPresent(lt -> {
            if (lt.getLockUtc() != null && lt.getLockUtc().isAfter(now)) {
                throw new AuthException(AuthErrorCode.AUTH_THROTTLED, "로그인 시도가 제한되었습니다. 잠시 후 다시 시도하세요.");
            }
        });
    }

    /**
     * 로그인 실패 누적 및 잠금 계산
     * @since 2025.12.28
     * @param keyType
     * @param keyVal
     * @return void
     */
    @Override
    @Transactional(transactionManager = "authTxManager")
    public void onFail(ThrottleKeyType keyType, String keyVal) {

        LocalDateTime now = dateTimeSupporter.nowUtc();

        LoginThrottle lt = repo.findForUpdate(keyType, keyVal).orElseGet(() -> {
            LoginThrottle e = new LoginThrottle();
            e.setId(ulid.newUlid());
            e.setKeyType(keyType);
            e.setKeyVal(keyVal);
            e.setFailCnt(0);
            e.setUAt(now);
            return e;
        });

        lt.setFailCnt(lt.getFailCnt() + 1);
        lt.setLastFailUtc(now);
        lt.setUAt(now);

        if (lt.getFailCnt() >= LOCK_THRESHOLD) {
            lt.setLockUtc(now.plusMinutes(LOCK_MINUTES));
        }

        repo.save(lt);
    }

    /**
     * 로그인 성공 시 실패 카운트 초기화
     * @since 2025.12.28
     * @param keyType
     * @param keyVal
     * @return void
     */
    @Override
    @Transactional(transactionManager = "authTxManager")
    public void onSuccess(ThrottleKeyType keyType, String keyVal) {

        LocalDateTime now = dateTimeSupporter.nowUtc();
        repo.findForUpdate(keyType, keyVal).ifPresent(lt -> {
            lt.setFailCnt(0);
            lt.setLockUtc(null);
            lt.setLastFailUtc(null);
            lt.setUAt(now);
            repo.save(lt);
        });
    }
}
