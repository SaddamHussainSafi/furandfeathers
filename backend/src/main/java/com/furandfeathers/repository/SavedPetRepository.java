package com.furandfeathers.repository;

import com.furandfeathers.entity.SavedPet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPetRepository extends JpaRepository<SavedPet, Long> {

    List<SavedPet> findByUserId(Long userId);

    Optional<SavedPet> findByUserIdAndPetId(Long userId, Long petId);

    @Query("SELECT COUNT(s) FROM SavedPet s WHERE s.user.id = ?1")
    Long countByUserId(Long userId);

    @Query("SELECT s FROM SavedPet s WHERE s.user.id = ?1 ORDER BY s.savedAt DESC")
    List<SavedPet> findByUserIdOrderBySavedAtDesc(Long userId);

    boolean existsByUserIdAndPetId(Long userId, Long petId);
}