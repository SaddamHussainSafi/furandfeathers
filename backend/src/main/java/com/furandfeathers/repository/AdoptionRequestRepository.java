package com.furandfeathers.repository;

import com.furandfeathers.entity.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {

    List<AdoptionRequest> findByUserId(Long userId);

    List<AdoptionRequest> findByPetId(Long petId);

    // NEW METHODS
    Long countByUserId(Long userId);

    Long countByStatus(String status);

    List<AdoptionRequest> findByStatus(String status);

    @Query("SELECT COUNT(ar) FROM AdoptionRequest ar WHERE ar.pet.owner.id = ?1")
    Long countByShelterId(Long shelterId);

    @Query("SELECT ar FROM AdoptionRequest ar WHERE ar.pet.owner.id = ?1 ORDER BY ar.createdAt DESC")
    List<AdoptionRequest> findByShelterIdOrderByCreatedAtDesc(Long shelterId);
}