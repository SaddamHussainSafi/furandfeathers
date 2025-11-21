package com.furandfeathers.repository;

import com.furandfeathers.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPetIdAndUserId(Long petId, Long userId);
    long countByPetId(Long petId);
}