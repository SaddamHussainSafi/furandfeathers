package com.furandfeathers.repository;

import com.furandfeathers.model.ShelterInfo;
import com.furandfeathers.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShelterInfoRepository extends JpaRepository<ShelterInfo, Long> {

    Optional<ShelterInfo> findByUserId(Long userId);

    List<ShelterInfo> findByApprovalStatus(ApprovalStatus status);

    @Query("SELECT s FROM ShelterInfo s WHERE s.approvalStatus = 'PENDING' ORDER BY s.createdAt ASC")
    List<ShelterInfo> findPendingShelters();

    @Query("SELECT COUNT(s) FROM ShelterInfo s WHERE s.approvalStatus = 'PENDING'")
    Long countPendingShelters();

    @Query("SELECT COUNT(s) FROM ShelterInfo s WHERE s.approvalStatus = 'APPROVED'")
    Long countApprovedShelters();
}