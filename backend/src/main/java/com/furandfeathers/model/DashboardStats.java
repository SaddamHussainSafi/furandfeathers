package com.furandfeathers.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dashboard_stats")
public class DashboardStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stats_key", nullable = false, unique = true)
    private String statsKey;

    @Column(name = "stats_data", columnDefinition = "TEXT", nullable = false)
    private String statsData; // JSON data

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public DashboardStats() {}

    public DashboardStats(String statsKey, String statsData, LocalDateTime expiresAt) {
        this.statsKey = statsKey;
        this.statsData = statsData;
        this.expiresAt = expiresAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatsKey() { return statsKey; }
    public void setStatsKey(String statsKey) { this.statsKey = statsKey; }

    public String getStatsData() { return statsData; }
    public void setStatsData(String statsData) {
        this.statsData = statsData;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper method
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}