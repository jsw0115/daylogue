package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.ExtCalAccountEntity;
import com.timepalette.daylogue.model.entity.settings.enums.ExtCalProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExtCalAccountRepository extends JpaRepository<ExtCalAccountEntity, String> {
	List<ExtCalAccountEntity> findAllByUserId(String userId);

	Optional<ExtCalAccountEntity> findByUserIdAndProvider(String userId, ExtCalProvider provider);
}
