package com.furandfeathers.model;

import com.furandfeathers.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "adopter_info")
public class AdopterInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "household_size")
    private Integer householdSize;

    @Column(name = "has_other_pets")
    private Boolean hasOtherPets = false;

    @Column(name = "pet_experience_years")
    private Integer petExperienceYears;

    @Column(name = "preferred_species", columnDefinition = "TEXT")
    private String preferredSpecies; // JSON array

    @Column(name = "housing_type")
    private String housingType; // APARTMENT, HOUSE, CONDO, etc.

    @Column(name = "has_yard")
    private Boolean hasYard = false;

    @Column(name = "daily_hours_home")
    private Integer dailyHoursHome;

    @Column(name = "allergic_to_pets")
    private Boolean allergicToPets = false;

    @Column(name = "adoption_reason", columnDefinition = "TEXT")
    private String adoptionReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public AdopterInfo() {}

    public AdopterInfo(User user) {
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) {
        this.occupation = occupation;
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getHouseholdSize() { return householdSize; }
    public void setHouseholdSize(Integer householdSize) {
        this.householdSize = householdSize;
        this.updatedAt = LocalDateTime.now();
    }

    public Boolean getHasOtherPets() { return hasOtherPets; }
    public void setHasOtherPets(Boolean hasOtherPets) {
        this.hasOtherPets = hasOtherPets;
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getPetExperienceYears() { return petExperienceYears; }
    public void setPetExperienceYears(Integer petExperienceYears) {
        this.petExperienceYears = petExperienceYears;
        this.updatedAt = LocalDateTime.now();
    }

    public String getPreferredSpecies() { return preferredSpecies; }
    public void setPreferredSpecies(String preferredSpecies) {
        this.preferredSpecies = preferredSpecies;
        this.updatedAt = LocalDateTime.now();
    }

    public String getHousingType() { return housingType; }
    public void setHousingType(String housingType) {
        this.housingType = housingType;
        this.updatedAt = LocalDateTime.now();
    }

    public Boolean getHasYard() { return hasYard; }
    public void setHasYard(Boolean hasYard) {
        this.hasYard = hasYard;
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getDailyHoursHome() { return dailyHoursHome; }
    public void setDailyHoursHome(Integer dailyHoursHome) {
        this.dailyHoursHome = dailyHoursHome;
        this.updatedAt = LocalDateTime.now();
    }

    public Boolean getAllergicToPets() { return allergicToPets; }
    public void setAllergicToPets(Boolean allergicToPets) {
        this.allergicToPets = allergicToPets;
        this.updatedAt = LocalDateTime.now();
    }

    public String getAdoptionReason() { return adoptionReason; }
    public void setAdoptionReason(String adoptionReason) {
        this.adoptionReason = adoptionReason;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}