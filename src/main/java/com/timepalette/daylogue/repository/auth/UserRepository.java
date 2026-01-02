package com.timepalette.daylogue.repository.auth;

import com.timepalette.daylogue.model.entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
//    Optional<User> findById(String id);
    User save(User user);
}
