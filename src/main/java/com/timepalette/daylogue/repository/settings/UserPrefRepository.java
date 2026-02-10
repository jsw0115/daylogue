package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.UserPrefEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPrefRepository extends JpaRepository<UserPrefEntity, String> {
}
