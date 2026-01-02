package com.timepalette.daylogue.config.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

public class AuthUser implements UserDetails {

    private final String id;
    private final String email;
    private final String nickname;
    private final String role; // USER | ADMIN
    private final String passwordHash; // 로그인 시에만 필요하면 유지
    private final boolean enabled;

    public AuthUser(String id, String email, String nickname, String role, String passwordHash, boolean enabled) {
        this.id = Objects.requireNonNull(id);
        this.email = Objects.requireNonNull(email);
        this.nickname = nickname;
        this.role = (role == null ? "USER" : role);
        this.passwordHash = passwordHash;
        this.enabled = enabled;
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getNickname() { return nickname; }
    public String getRole() { return role; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // ROLE_ 접두어는 스프링 시큐리티 관례
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        // username에 email을 쓰는 방식
        return email;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }
}
