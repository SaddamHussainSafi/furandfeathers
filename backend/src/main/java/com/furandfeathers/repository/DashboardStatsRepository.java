package com.furandfeathers.repository;

import com.furandfeathers.model.DashboardStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DashboardStatsRepository extends JpaRepository<DashboardStats, Long> {

    Optional<DashboardStats> findByStatsKey(String statsKey);

    @Query("SELECT d FROM DashboardStats d WHERE d.statsKey = ?1 AND d.expiresAt > CURRENT_TIMESTAMP")
    Optional<DashboardStats> findValidByStatsKey(String statsKey);

    void deleteByStatsKey(String statsKey);
}