package com.furandfeathers.controller;

import com.furandfeathers.dto.request.*;
import com.furandfeathers.enums.UserRole;
import com.furandfeathers.entity.Pet;
import com.furandfeathers.entity.User;
import com.furandfeathers.model.Notification;
import com.furandfeathers.model.ShelterInfo;
import com.furandfeathers.model.SystemSetting;
import com.furandfeathers.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('SUPERADMIN') or hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private ShelterApprovalService shelterApprovalService;

    @Autowired
    private PetApprovalService petApprovalService;

    @Autowired
    private AdminUserManagementService userManagementService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SystemSettingsService systemSettingsService;

    // Dashboard endpoints
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/dashboard/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(dashboardService.getSystemHealth());
    }

    // Shelter approval endpoints
    @GetMapping("/shelters/pending")
    public ResponseEntity<List<ShelterInfo>> getPendingShelters() {
        return ResponseEntity.ok(shelterApprovalService.getPendingShelters());
    }

    @PostMapping("/shelters/{shelterId}/approve")
    public ResponseEntity<ShelterInfo> approveShelter(@PathVariable Long shelterId,
                                                     @RequestParam Long adminId,
                                                     @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(shelterApprovalService.approveShelter(shelterId, adminId, reason != null ? reason : "Approved by admin"));
    }

    @PostMapping("/shelters/{shelterId}/reject")
    public ResponseEntity<ShelterInfo> rejectShelter(@PathVariable Long shelterId,
                                                    @RequestParam Long adminId,
                                                    @RequestBody ShelterApprovalRequest request) {
        return ResponseEntity.ok(shelterApprovalService.rejectShelter(shelterId, adminId, request.getRejectionReason()));
    }

    // Pet approval endpoints
    @GetMapping("/pets/pending")
    public ResponseEntity<List<Pet>> getPendingPets() {
        return ResponseEntity.ok(petApprovalService.getPendingPets());
    }

    @PostMapping("/pets/{petId}/approve")
    public ResponseEntity<Pet> approvePet(@PathVariable Long petId,
                                         @RequestParam Long adminId,
                                         @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(petApprovalService.approvePet(petId, adminId, reason != null ? reason : "Approved by admin"));
    }

    @PostMapping("/pets/{petId}/reject")
    public ResponseEntity<Pet> rejectPet(@PathVariable Long petId,
                                        @RequestParam Long adminId,
                                        @RequestBody PetApprovalRequest request) {
        return ResponseEntity.ok(petApprovalService.rejectPet(petId, adminId, request.getRejectionReason()));
    }

    @PutMapping("/pets/{petId}/visibility")
    public ResponseEntity<Pet> updatePetVisibility(@PathVariable Long petId,
                                                  @RequestParam boolean visible,
                                                  @RequestParam Long adminId) {
        return ResponseEntity.ok(petApprovalService.updatePetVisibility(petId, visible, adminId));
    }

    // User management endpoints
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userManagementService.getUsersByRole(UserRole.valueOf(role.toUpperCase())));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userManagementService.getUserById(userId));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long userId,
                                              @RequestBody UserRoleUpdateRequest request,
                                              @RequestParam Long adminId) {
        return ResponseEntity.ok(userManagementService.updateUserRoleAndStatus(userId, request.getRole(), request.getStatus(), adminId));
    }

    @PostMapping("/users/{userId}/suspend")
    public ResponseEntity<User> suspendUser(@PathVariable Long userId,
                                           @RequestParam Long adminId,
                                           @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(userManagementService.suspendUser(userId, reason != null ? reason : "Suspended by admin", adminId));
    }

    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long userId,
                                            @RequestParam Long adminId,
                                            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(userManagementService.activateUser(userId, reason != null ? reason : "Activated by admin", adminId));
    }

    @PostMapping("/users/{userId}/set-superadmin")
    public ResponseEntity<User> setSuperAdmin(@PathVariable Long userId,
                                             @RequestParam Long adminId) {
        return ResponseEntity.ok(userManagementService.setSuperAdmin(userId, adminId));
    }

    // Notification management endpoints
    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getAllNotifications(@RequestParam Long userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/notifications/unread-count")
    public ResponseEntity<Long> getUnreadNotificationsCount(@RequestParam Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotificationsCount(userId));
    }

    @PostMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long notificationId) {
        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }

    @PostMapping("/notifications/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@RequestParam Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    // Audit log endpoints
    @GetMapping("/audit")
    public ResponseEntity<String> getAuditLogs(@RequestParam(defaultValue = "50") int limit) {
        // TODO: Implement audit log retrieval with pagination
        return ResponseEntity.ok("Audit logs endpoint - to be implemented");
    }

    // System settings endpoints
    @GetMapping("/settings")
    public ResponseEntity<List<SystemSetting>> getAllSettings() {
        return ResponseEntity.ok(systemSettingsService.getAllSettings());
    }

    @GetMapping("/settings/{key}")
    public ResponseEntity<SystemSetting> getSettingByKey(@PathVariable String key) {
        return ResponseEntity.ok(systemSettingsService.getSettingByKey(key));
    }

    @PutMapping("/settings/{key}")
    public ResponseEntity<SystemSetting> updateSetting(@PathVariable String key,
                                                      @RequestBody SystemSettingUpdateRequest request,
                                                      @RequestParam Long adminId) {
        return ResponseEntity.ok(systemSettingsService.updateSetting(key, request.getSettingValue(), adminId));
    }

    @PostMapping("/settings")
    public ResponseEntity<SystemSetting> createSetting(@RequestBody SystemSettingCreateRequest request,
                                                      @RequestParam Long adminId) {
        return ResponseEntity.ok(systemSettingsService.createSetting(
            request.getSettingKey(),
            request.getSettingValue(),
            request.getCategory(),
            request.getDescription(),
            request.getDataType(),
            adminId
        ));
    }

    @DeleteMapping("/settings/{key}")
    public ResponseEntity<Void> deleteSetting(@PathVariable String key, @RequestParam Long adminId) {
        systemSettingsService.deleteSetting(key, adminId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/settings/category/{category}")
    public ResponseEntity<List<SystemSetting>> getSettingsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(systemSettingsService.getSettingsByCategory(category));
    }

    // Helper DTO for creating settings
    public static class SystemSettingCreateRequest {
        private String settingKey;
        private String settingValue;
        private String category;
        private String description;
        private String dataType;

        // Getters and Setters
        public String getSettingKey() { return settingKey; }
        public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

        public String getSettingValue() { return settingValue; }
        public void setSettingValue(String settingValue) { this.settingValue = settingValue; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getDataType() { return dataType; }
        public void setDataType(String dataType) { this.dataType = dataType; }
    }
}