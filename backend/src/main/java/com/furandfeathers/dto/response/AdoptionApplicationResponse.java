package com.furandfeathers.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdoptionApplicationResponse {
    private Long id;
    private String status;
    private String message;
    private String housingType;
    private Integer householdSize;
    private Boolean hasOtherPets;
    private String otherPetsDetails;
    private String experienceLevel;
    private String dailySchedule;
    private String lifestyleNotes;
    private String adoptionTimeline;
    private String preferredVisitWindow;
    private String contactPhone;
    private String contactEmail;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
    private String adminNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long petId;
    private String petName;
    private String petImage;
    private String petLocation;

    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
}
