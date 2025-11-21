package com.furandfeathers.dto.response;

import java.util.Map;

public class DashboardStatsResponse {
    private Long totalUsers;
    private Long totalPets;
    private Long totalAdoptions;
    private Long pendingApprovals;
    private Long activeUsers;
    private Long totalShelters;
    private Long approvedShelters;
    private Long pendingShelters;
    private Long approvedPets;
    private Long pendingPets;
    private Long adoptedPets;
    private Map<String, Long> userRoleDistribution;
    private Map<String, Long> petStatusDistribution;
    private Map<String, Long> adoptionStatusDistribution;

    // Constructors
    public DashboardStatsResponse() {}

    // Getters and Setters
    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalPets() { return totalPets; }
    public void setTotalPets(Long totalPets) { this.totalPets = totalPets; }

    public Long getTotalAdoptions() { return totalAdoptions; }
    public void setTotalAdoptions(Long totalAdoptions) { this.totalAdoptions = totalAdoptions; }

    public Long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(Long pendingApprovals) { this.pendingApprovals = pendingApprovals; }

    public Long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(Long activeUsers) { this.activeUsers = activeUsers; }

    public Long getTotalShelters() { return totalShelters; }
    public void setTotalShelters(Long totalShelters) { this.totalShelters = totalShelters; }

    public Long getApprovedShelters() { return approvedShelters; }
    public void setApprovedShelters(Long approvedShelters) { this.approvedShelters = approvedShelters; }

    public Long getPendingShelters() { return pendingShelters; }
    public void setPendingShelters(Long pendingShelters) { this.pendingShelters = pendingShelters; }

    public Long getApprovedPets() { return approvedPets; }
    public void setApprovedPets(Long approvedPets) { this.approvedPets = approvedPets; }

    public Long getPendingPets() { return pendingPets; }
    public void setPendingPets(Long pendingPets) { this.pendingPets = pendingPets; }

    public Long getAdoptedPets() { return adoptedPets; }
    public void setAdoptedPets(Long adoptedPets) { this.adoptedPets = adoptedPets; }

    public Map<String, Long> getUserRoleDistribution() { return userRoleDistribution; }
    public void setUserRoleDistribution(Map<String, Long> userRoleDistribution) { this.userRoleDistribution = userRoleDistribution; }

    public Map<String, Long> getPetStatusDistribution() { return petStatusDistribution; }
    public void setPetStatusDistribution(Map<String, Long> petStatusDistribution) { this.petStatusDistribution = petStatusDistribution; }

    public Map<String, Long> getAdoptionStatusDistribution() { return adoptionStatusDistribution; }
    public void setAdoptionStatusDistribution(Map<String, Long> adoptionStatusDistribution) { this.adoptionStatusDistribution = adoptionStatusDistribution; }
}