package com.timepalette.daylogue.model.enums.common;

public enum ActionCode {
    
    READ(0, "READ"),
    WRITE(1, "WRITE"),
    MODIFY(2, "MODIFY"),
    SHARE(3, "SHARE")
    ;

    private int code;
    private String action;

    ActionCode(int code, String action) {
        this.code = code;
        this.action = action;
    }
}
