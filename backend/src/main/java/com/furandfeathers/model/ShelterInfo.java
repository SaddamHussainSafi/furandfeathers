package com.furandfeathers.model;

import com.furandfeathers.enums.ApprovalStatus;
import com.furandfeathers.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "shelter_info")
public class ShelterInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(name = "organization_name", nullable = false)
    private String organizationName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "facility_type", nullable = false)
    private FacilityType facilityType = FacilityType.SHELTER;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "website")
    private String website;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "documents", columnDefinition = "TEXT")
    private String documents; // JSON array of document URLs

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "established_year")
    private Integer establishedYear;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum FacilityType {
        SHELTER, RESCUE, BREEDER, OWNER
    }

    // Constructors
    public ShelterInfo() {}

    public ShelterInfo(User user, String organizationName, FacilityType facilityType) {
        this.user = user;
        this.organizationName = organizationName;
        this.facilityType = facilityType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
        this.updatedAt = LocalDateTime.now();
    }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
        this.updatedAt = LocalDateTime.now();
    }

    public FacilityType getFacilityType() { return facilityType; }
    public void setFacilityType(FacilityType facilityType) {
        this.facilityType = facilityType;
        this.updatedAt = LocalDateTime.now();
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public String getWebsite() { return website; }
    public void setWebsite(String website) {
        this.website = website;
        this.updatedAt = LocalDateTime.now();
    }

    public ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
        this.updatedAt = LocalDateTime.now();
    }

    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) {
        this.approvedBy = approvedBy;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
        this.updatedAt = LocalDateTime.now();
    }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
        this.updatedAt = LocalDateTime.now();
    }

    public String getDocuments() { return documents; }
    public void setDocuments(String documents) {
        this.documents = documents;
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getEstablishedYear() { return establishedYear; }
    public void setEstablishedYear(Integer establishedYear) {
        this.establishedYear = establishedYear;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}