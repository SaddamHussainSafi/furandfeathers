package com.furandfeathers.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.furandfeathers.enums.ListingStatus;
import com.furandfeathers.enums.UserRole;
import com.furandfeathers.enums.UserStatus;
import com.furandfeathers.model.DashboardStats;
import com.furandfeathers.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ShelterInfoRepository shelterInfoRepository;

    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;

    @Autowired
    private DashboardStatsRepository dashboardStatsRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Get dashboard statistics
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // User statistics
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByStatus(UserStatus.ACTIVE));
        stats.put("userRoleDistribution", getUserRoleDistribution());

        // Pet statistics
        stats.put("totalPets", petRepository.count());
        stats.put("approvedPets", petRepository.countByListingStatus(ListingStatus.APPROVED));
        stats.put("pendingPets", petRepository.countByListingStatus(ListingStatus.PENDING_REVIEW));
        stats.put("adoptedPets", petRepository.countByListingStatus(ListingStatus.ADOPTED));
        stats.put("petStatusDistribution", getPetStatusDistribution());

        // Shelter statistics
        stats.put("totalShelters", shelterInfoRepository.count());
        stats.put("approvedShelters", shelterInfoRepository.countApprovedShelters());
        stats.put("pendingShelters", shelterInfoRepository.countPendingShelters());

        // Adoption statistics
        stats.put("totalAdoptions", adoptionRequestRepository.count());
        stats.put("pendingApprovals", adoptionRequestRepository.countByStatus("PENDING"));

        return stats;
    }

    // Get user role distribution
    private Map<String, Long> getUserRoleDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        for (UserRole role : UserRole.values()) {
            distribution.put(role.name(), userRepository.countByRole(role));
        }
        return distribution;
    }

    // Get pet status distribution
    private Map<String, Long> getPetStatusDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        for (ListingStatus status : ListingStatus.values()) {
            distribution.put(status.name(), petRepository.countByListingStatus(status));
        }
        return distribution;
    }

    // Cache dashboard stats (for performance)
    public void updateCachedStats() {
        try {
            Map<String, Object> stats = getDashboardStats();
            String statsJson = objectMapper.writeValueAsString(stats);

            DashboardStats dashboardStats = dashboardStatsRepository.findByStatsKey("main_dashboard")
                    .orElse(new DashboardStats());

            dashboardStats.setStatsKey("main_dashboard");
            dashboardStats.setStatsData(statsJson);
            dashboardStats.setExpiresAt(LocalDateTime.now().plusMinutes(30)); // Cache for 30 minutes

            dashboardStatsRepository.save(dashboardStats);
        } catch (JsonProcessingException e) {
            // Log error
        }
    }

    // Get cached dashboard stats
    public Map<String, Object> getCachedStats() {
        Optional<DashboardStats> cached = dashboardStatsRepository.findValidByStatsKey("main_dashboard");

        if (cached.isPresent()) {
            try {
                return objectMapper.readValue(cached.get().getStatsData(), new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                // Fall back to fresh data
            }
        }

        // Update cache and return fresh data
        updateCachedStats();
        return getDashboardStats();
    }

    // Get system health metrics
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();

        // Database connectivity
        try {
            userRepository.count();
            health.put("database", "UP");
        } catch (Exception e) {
            health.put("database", "DOWN");
        }

        // Pending items
        health.put("pendingShelters", shelterInfoRepository.countPendingShelters());
        health.put("pendingPets", petRepository.countByListingStatus(ListingStatus.PENDING_REVIEW));
        health.put("pendingAdoptions", adoptionRequestRepository.countByStatus("PENDING"));

        return health;
    }
}