package com.furandfeathers.service;

import com.furandfeathers.entity.Pet;
import com.furandfeathers.entity.User;
import com.furandfeathers.enums.ActionType;
import com.furandfeathers.enums.ListingStatus;
import com.furandfeathers.enums.NotificationType;
import com.furandfeathers.repository.PetRepository;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PetApprovalService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    // Get all pending pets
    public List<Pet> getPendingPets() {
        return petRepository.findByListingStatus(ListingStatus.PENDING_REVIEW);
    }

    // Get pet by ID
    public Pet getPetById(Long petId) {
        return petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));
    }

    // Approve pet
    @Transactional
    public Pet approvePet(Long petId, Long adminId, String reason) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        // Update pet status
        pet.setListingStatus(ListingStatus.APPROVED);
        pet.setReviewedBy(admin.getId());
        pet.setReviewedAt(LocalDateTime.now());
        pet.setPublishedAt(LocalDateTime.now());

        // Save changes
        petRepository.save(pet);

        // Send notification to shelter
        notificationService.sendNotification(
            pet.getOwner(),
            NotificationType.PET_APPROVED,
            "Pet Approved",
            "Your pet '" + pet.getName() + "' has been approved and is now visible to adopters."
        );

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.PET_APPROVED,
            pet.getOwner(),
            "PET",
            pet.getId(),
            reason
        );

        return pet;
    }

    // Reject pet
    @Transactional
    public Pet rejectPet(Long petId, Long adminId, String reason) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        // Update pet status
        pet.setListingStatus(ListingStatus.REJECTED);
        pet.setRejectionReason(reason);
        pet.setReviewedBy(admin.getId());
        pet.setReviewedAt(LocalDateTime.now());

        // Save changes
        petRepository.save(pet);

        // Send notification to shelter
        notificationService.sendNotification(
            pet.getOwner(),
            NotificationType.PET_REJECTED,
            "Pet Rejected",
            "Your pet '" + pet.getName() + "' has been rejected. Reason: " + reason
        );

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.PET_REJECTED,
            pet.getOwner(),
            "PET",
            pet.getId(),
            reason
        );

        return pet;
    }

    // Get pending pets count
    public Long getPendingPetsCount() {
        return petRepository.countByListingStatus(ListingStatus.PENDING_REVIEW);
    }

    // Get pets by shelter
    public List<Pet> getPetsByShelter(Long shelterId) {
        return petRepository.findByOwnerIdOrderByCreatedAtDesc(shelterId);
    }

    // Update pet visibility
    @Transactional
    public Pet updatePetVisibility(Long petId, boolean visible, Long adminId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        String oldVisibility = pet.getVisibility().toString();
        pet.setVisibility(visible ? Pet.Visibility.PUBLIC : Pet.Visibility.PRIVATE);

        petRepository.save(pet);

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.OTHER,
            pet.getOwner(),
            "PET",
            pet.getId(),
            "Changed visibility from " + oldVisibility + " to " + pet.getVisibility(),
            oldVisibility,
            pet.getVisibility().toString()
        );

        return pet;
    }
}