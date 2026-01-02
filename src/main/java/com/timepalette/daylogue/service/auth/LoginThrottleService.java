package com.timepalette.daylogue.service.auth;

import com.timepalette.daylogue.model.enums.auth.ThrottleKeyType;

public interface LoginThrottleService {

    public void checkLockedOrThrow(ThrottleKeyType keyType, String keyVal);
    public void onFail(ThrottleKeyType keyType, String keyVal);
    public void onSuccess(ThrottleKeyType keyType, String keyVal);
}
