package com.furandfeathers.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoption_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdoptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "housing_type")
    private String housingType;

    @Column(name = "household_size")
    private Integer householdSize;

    @Column(name = "has_other_pets")
    @Builder.Default
    private Boolean hasOtherPets = false;

    @Column(name = "other_pets_details", columnDefinition = "TEXT")
    private String otherPetsDetails;

    @Column(name = "experience_level")
    private String experienceLevel;

    @Column(name = "daily_schedule", columnDefinition = "TEXT")
    private String dailySchedule;

    @Column(name = "lifestyle_notes", columnDefinition = "TEXT")
    private String lifestyleNotes;

    @Column(name = "adoption_timeline")
    private String adoptionTimeline;

    @Column(name = "preferred_visit_window")
    private String preferredVisitWindow;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "address_line", columnDefinition = "TEXT")
    private String addressLine;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void onCreate() {
        if (status == null) {
            status = "PENDING";
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
