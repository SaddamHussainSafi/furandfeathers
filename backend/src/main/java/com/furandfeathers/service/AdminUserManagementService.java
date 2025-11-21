package com.furandfeathers.service;

import com.furandfeathers.entity.User;
import com.furandfeathers.enums.ActionType;
import com.furandfeathers.enums.UserRole;
import com.furandfeathers.enums.UserStatus;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminUserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    // Get all users with pagination
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get users by role
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRoleOrderByCreatedAtDesc(role);
    }

    // Get user by ID
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    // Update user role and status
    @Transactional
    public User updateUserRoleAndStatus(Long userId, UserRole newRole, UserStatus newStatus, Long adminId) {
        User user = getUserById(userId);
        User admin = getUserById(adminId);

        String oldRole = user.getRole().toString();
        String oldStatus = user.getStatus().toString();

        user.setRole(newRole);
        user.setStatus(newStatus);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.ROLE_CHANGED,
            user,
            "USER",
            user.getId(),
            "Role changed from " + oldRole + " to " + newRole + ", Status changed from " + oldStatus + " to " + newStatus,
            oldRole + "/" + oldStatus,
            newRole + "/" + newStatus
        );

        return user;
    }

    // Suspend user
    @Transactional
    public User suspendUser(Long userId, String reason, Long adminId) {
        User user = getUserById(userId);
        User admin = getUserById(adminId);

        user.setStatus(UserStatus.SUSPENDED);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.USER_SUSPENDED,
            user,
            "USER",
            user.getId(),
            reason
        );

        return user;
    }

    // Activate user
    @Transactional
    public User activateUser(Long userId, String reason, Long adminId) {
        User user = getUserById(userId);
        User admin = getUserById(adminId);

        user.setStatus(UserStatus.ACTIVE);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.USER_ACTIVATED,
            user,
            "USER",
            user.getId(),
            reason
        );

        return user;
    }

    // Delete user (soft delete by setting status to REJECTED)
    @Transactional
    public void deleteUser(Long userId, String reason, Long adminId) {
        User user = getUserById(userId);
        User admin = getUserById(adminId);

        // Prevent deletion of system protected users
        if (user.getIsSystemProtected() != null && user.getIsSystemProtected()) {
            throw new IllegalArgumentException("Cannot delete system protected user");
        }

        user.setStatus(UserStatus.REJECTED);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.USER_DELETED,
            user,
            "USER",
            user.getId(),
            reason
        );
    }

    // Get user statistics
    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getActiveUsers() {
        return userRepository.countByStatus(UserStatus.ACTIVE);
    }

    public long getSuspendedUsers() {
        return userRepository.countByStatus(UserStatus.SUSPENDED);
    }

    // Set user as superadmin (system protected)
    @Transactional
    public User setSuperAdmin(Long userId, Long adminId) {
        User user = getUserById(userId);
        User admin = getUserById(adminId);

        String oldRole = user.getRole().toString();

        user.setRole(UserRole.SUPERADMIN);
        user.setIsSystemProtected(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.ROLE_CHANGED,
            user,
            "USER",
            user.getId(),
            "User set as SUPERADMIN with system protection",
            oldRole,
            "SUPERADMIN"
        );

        return user;
    }
}