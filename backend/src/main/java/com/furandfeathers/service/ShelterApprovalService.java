package com.furandfeathers.service;

import com.furandfeathers.model.*;
import com.furandfeathers.repository.*;
import com.furandfeathers.enums.*;
import com.furandfeathers.exception.ResourceNotFoundException;
import com.furandfeathers.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShelterApprovalService {

    @Autowired
    private ShelterInfoRepository shelterInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    // Get all pending shelters
    public List<ShelterInfo> getPendingShelters() {
        return shelterInfoRepository.findPendingShelters();
    }

    // Get shelter info by user ID
    public ShelterInfo getShelterInfoByUserId(Long userId) {
        return shelterInfoRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter info not found for user: " + userId));
    }

    // Approve shelter
    @Transactional
    public ShelterInfo approveShelter(Long shelterId, Long adminId, String reason) {
        ShelterInfo shelterInfo = shelterInfoRepository.findById(shelterId)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found with id: " + shelterId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        // Update shelter status
        shelterInfo.setApprovalStatus(ApprovalStatus.APPROVED);
        shelterInfo.setApprovedBy(admin);
        shelterInfo.setApprovedAt(LocalDateTime.now());

        // Update user status
        User shelterUser = shelterInfo.getUser();
        shelterUser.setStatus(UserStatus.ACTIVE);

        // Save changes
        shelterInfoRepository.save(shelterInfo);
        userRepository.save(shelterUser);

        // Send notification
        notificationService.sendNotification(
            shelterUser,
            NotificationType.SHELTER_APPROVED,
            "Shelter Approved",
            "Congratulations! Your shelter registration has been approved. You can now start adding pets to your shelter."
        );

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.SHELTER_APPROVED,
            shelterUser,
            null,
            null,
            reason
        );

        return shelterInfo;
    }

    // Reject shelter
    @Transactional
    public ShelterInfo rejectShelter(Long shelterId, Long adminId, String reason) {
        ShelterInfo shelterInfo = shelterInfoRepository.findById(shelterId)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found with id: " + shelterId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        // Update shelter status
        shelterInfo.setApprovalStatus(ApprovalStatus.REJECTED);
        shelterInfo.setRejectionReason(reason);

        // Update user status
        User shelterUser = shelterInfo.getUser();
        shelterUser.setStatus(UserStatus.REJECTED);

        // Save changes
        shelterInfoRepository.save(shelterInfo);
        userRepository.save(shelterUser);

        // Send notification
        notificationService.sendNotification(
            shelterUser,
            NotificationType.SHELTER_REJECTED,
            "Shelter Registration Rejected",
            "Unfortunately, your shelter registration has been rejected. Reason: " + reason
        );

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.SHELTER_REJECTED,
            shelterUser,
            null,
            null,
            reason
        );

        return shelterInfo;
    }

    // Get pending shelters count
    public Long getPendingSheltersCount() {
        return shelterInfoRepository.countPendingShelters();
    }
}