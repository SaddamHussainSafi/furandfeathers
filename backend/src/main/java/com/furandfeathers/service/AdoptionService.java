package com.furandfeathers.service;

import com.furandfeathers.dto.request.AdoptionApplicationRequest;
import com.furandfeathers.dto.request.AdoptionStatusUpdateRequest;
import com.furandfeathers.dto.response.AdoptionApplicationResponse;
import com.furandfeathers.entity.AdoptionRequest;
import com.furandfeathers.entity.Pet;
import com.furandfeathers.entity.User;
import com.furandfeathers.repository.AdoptionRequestRepository;
import com.furandfeathers.repository.PetRepository;
import com.furandfeathers.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdoptionService {

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public AdoptionService(AdoptionRequestRepository adoptionRequestRepository,
                           PetRepository petRepository,
                           UserRepository userRepository) {
        this.adoptionRequestRepository = adoptionRequestRepository;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    public AdoptionApplicationResponse submitApplication(String userEmail, AdoptionApplicationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));

        boolean alreadyApplied = adoptionRequestRepository.findByUserId(user.getId()).stream()
                .anyMatch(ar -> ar.getPet().getId().equals(pet.getId()) &&
                        !"REJECTED".equalsIgnoreCase(ar.getStatus()) &&
                        !"CANCELLED".equalsIgnoreCase(ar.getStatus()));

        if (alreadyApplied) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have an active application for this pet");
        }

        AdoptionRequest adoptionRequest = AdoptionRequest.builder()
                .user(user)
                .pet(pet)
                .build();

        adoptionRequest.setMessage(request.getMessage());
        adoptionRequest.setHousingType(request.getHousingType());
        adoptionRequest.setHouseholdSize(request.getHouseholdSize());
        adoptionRequest.setHasOtherPets(Boolean.TRUE.equals(request.getHasOtherPets()));
        adoptionRequest.setOtherPetsDetails(request.getOtherPetsDetails());
        adoptionRequest.setExperienceLevel(request.getExperienceLevel());
        adoptionRequest.setDailySchedule(request.getDailySchedule());
        adoptionRequest.setLifestyleNotes(request.getLifestyleNotes());
        adoptionRequest.setAdoptionTimeline(request.getAdoptionTimeline());
        adoptionRequest.setPreferredVisitWindow(request.getPreferredVisitWindow());
        adoptionRequest.setContactPhone(request.getContactPhone());
        adoptionRequest.setContactEmail(request.getContactEmail() != null ? request.getContactEmail() : user.getEmail());
        adoptionRequest.setAddressLine(request.getAddressLine());
        adoptionRequest.setCity(request.getCity());
        adoptionRequest.setState(request.getState());
        adoptionRequest.setPostalCode(request.getPostalCode());

        AdoptionRequest saved = adoptionRequestRepository.save(adoptionRequest);
        return mapToResponse(saved);
    }

    public List<AdoptionApplicationResponse> getMyApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return adoptionRequestRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AdoptionApplicationResponse> getManageableApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (user.getRole() == null ||
                (!"ADMIN".equalsIgnoreCase(user.getRole().name()) &&
                 !"SUPERADMIN".equalsIgnoreCase(user.getRole().name()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin or super admin can manage adoptions");
        }

        return adoptionRequestRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AdoptionApplicationResponse getApplicationDetail(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        AdoptionRequest adoptionRequest = adoptionRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        boolean isOwner = adoptionRequest.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() != null &&
                ("ADMIN".equalsIgnoreCase(user.getRole().name()) || "SUPERADMIN".equalsIgnoreCase(user.getRole().name()));

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view this application");
        }

        return mapToResponse(adoptionRequest);
    }

    public AdoptionApplicationResponse updateStatus(Long id, AdoptionStatusUpdateRequest request, String reviewerEmail) {
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (reviewer.getRole() == null ||
                (!"ADMIN".equalsIgnoreCase(reviewer.getRole().name()) &&
                 !"SUPERADMIN".equalsIgnoreCase(reviewer.getRole().name()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin or super admin can update applications");
        }

        AdoptionRequest adoptionRequest = adoptionRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (request.getStatus() != null) {
            adoptionRequest.setStatus(request.getStatus().toUpperCase());
        }
        adoptionRequest.setAdminNotes(request.getAdminNotes());
        adoptionRequest.setRejectionReason(request.getRejectionReason());
        adoptionRequest.setReviewedBy(reviewer.getId());
        adoptionRequest.setReviewedAt(LocalDateTime.now());

        AdoptionRequest updated = adoptionRequestRepository.save(adoptionRequest);
        return mapToResponse(updated);
    }

    private AdoptionApplicationResponse mapToResponse(AdoptionRequest request) {
        Pet pet = request.getPet();
        User applicant = request.getUser();

        return AdoptionApplicationResponse.builder()
                .id(request.getId())
                .status(request.getStatus())
                .message(request.getMessage())
                .housingType(request.getHousingType())
                .householdSize(request.getHouseholdSize())
                .hasOtherPets(request.getHasOtherPets())
                .otherPetsDetails(request.getOtherPetsDetails())
                .experienceLevel(request.getExperienceLevel())
                .dailySchedule(request.getDailySchedule())
                .lifestyleNotes(request.getLifestyleNotes())
                .adoptionTimeline(request.getAdoptionTimeline())
                .preferredVisitWindow(request.getPreferredVisitWindow())
                .contactPhone(request.getContactPhone())
                .contactEmail(request.getContactEmail())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .adminNotes(request.getAdminNotes())
                .rejectionReason(request.getRejectionReason())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .petId(pet != null ? pet.getId() : null)
                .petName(pet != null ? pet.getName() : null)
                .petImage(pet != null ? (pet.getImageUrl() != null ? pet.getImageUrl() : pet.getImagePath()) : null)
                .petLocation(pet != null ? pet.getLocation() : null)
                .applicantId(applicant != null ? applicant.getId() : null)
                .applicantName(applicant != null ? applicant.getName() : null)
                .applicantEmail(applicant != null ? applicant.getEmail() : null)
                .build();
    }
}
