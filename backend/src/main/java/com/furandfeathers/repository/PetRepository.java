package com.furandfeathers.repository;

import com.furandfeathers.entity.Pet;
import com.furandfeathers.entity.User;
import com.furandfeathers.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface PetRepository extends JpaRepository<Pet, Long> {

    List<Pet> findByOwner(User owner);

    @Query("SELECT p FROM Pet p JOIN FETCH p.owner")
    List<Pet> findAllWithOwners();

    Optional<Pet> findFirstByNameIgnoreCase(String name);

    List<Pet> findByBreedIgnoreCaseAndStatus(String breed, String status);

    List<Pet> findByStatus(String status);

    // NEW METHODS FOR ADMIN PANEL
    List<Pet> findByListingStatus(ListingStatus status);

    Long countByListingStatus(ListingStatus status);

    Long countByOwnerId(Long ownerId);

    Long countByOwnerIdAndListingStatus(Long ownerId, ListingStatus status);

    List<Pet> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
}
