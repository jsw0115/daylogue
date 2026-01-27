package com.timepalette.daylogue.repository.auth;

import com.timepalette.daylogue.model.entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);
}
