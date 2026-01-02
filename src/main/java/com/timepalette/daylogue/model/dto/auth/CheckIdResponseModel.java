package com.timepalette.daylogue.model.dto.auth;

/**
 * 아이디(이메일/username) 사용 가능 체크 응답
 * @since 2025.12.27
 */
public class CheckIdResponseModel {

    private boolean available;

    public CheckIdResponseModel() {}

    public CheckIdResponseModel(boolean available) {
        this.available = available;
    }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
