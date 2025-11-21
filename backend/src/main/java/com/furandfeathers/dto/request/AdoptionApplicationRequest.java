package com.furandfeathers.dto.request;

import lombok.Data;

@Data
public class AdoptionApplicationRequest {
    private Long petId;
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
}
