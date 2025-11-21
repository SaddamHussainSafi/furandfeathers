package com.furandfeathers.service;

import com.furandfeathers.entity.User;
import com.furandfeathers.enums.ActionType;
import com.furandfeathers.model.SystemSetting;
import com.furandfeathers.repository.SystemSettingRepository;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SystemSettingsService {

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    // Get all system settings
    public List<SystemSetting> getAllSettings() {
        return systemSettingRepository.findAll();
    }

    // Get setting by key
    public SystemSetting getSettingByKey(String key) {
        return systemSettingRepository.findBySettingKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("System setting not found: " + key));
    }

    // Get setting value by key
    public String getSettingValue(String key) {
        Optional<SystemSetting> setting = systemSettingRepository.findBySettingKey(key);
        return setting.map(SystemSetting::getSettingValue).orElse(null);
    }

    // Update setting
    @Transactional
    public SystemSetting updateSetting(String key, String newValue, Long adminId) {
        SystemSetting setting = getSettingByKey(key);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        String oldValue = setting.getSettingValue();
        setting.setSettingValue(newValue);
        setting.setUpdatedBy(admin);
        setting.setUpdatedAt(LocalDateTime.now());

        systemSettingRepository.save(setting);

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.SYSTEM_SETTING_CHANGED,
            null,
            "SYSTEM_SETTING",
            setting.getId(),
            "Setting '" + key + "' changed",
            oldValue,
            newValue
        );

        return setting;
    }

    // Create new setting
    @Transactional
    public SystemSetting createSetting(String key, String value, String category, String description, String dataType, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        SystemSetting setting = new SystemSetting();
        setting.setSettingKey(key);
        setting.setSettingValue(value);
        setting.setCategory(category);
        setting.setDescription(description);
        setting.setDataType(dataType);
        setting.setUpdatedBy(admin);
        setting.setCreatedAt(LocalDateTime.now());
        setting.setUpdatedAt(LocalDateTime.now());

        systemSettingRepository.save(setting);

        // Log audit action
        auditService.logAction(
            admin,
            ActionType.OTHER,
            null,
            "SYSTEM_SETTING",
            setting.getId(),
            "New system setting created: " + key
        );

        return setting;
    }

    // Delete setting
    @Transactional
    public void deleteSetting(String key, Long adminId) {
        SystemSetting setting = getSettingByKey(key);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        // Log audit action before deletion
        auditService.logAction(
            admin,
            ActionType.OTHER,
            null,
            "SYSTEM_SETTING",
            setting.getId(),
            "System setting deleted: " + key
        );

        systemSettingRepository.delete(setting);
    }

    // Get settings by category
    public List<SystemSetting> getSettingsByCategory(String category) {
        return systemSettingRepository.findByCategory(category);
    }

    // Bulk update settings
    @Transactional
    public void bulkUpdateSettings(List<SystemSettingUpdateRequest> updates, Long adminId) {
        for (SystemSettingUpdateRequest update : updates) {
            try {
                updateSetting(update.getSettingKey(), update.getSettingValue(), adminId);
            } catch (ResourceNotFoundException e) {
                // Create new setting if it doesn't exist
                createSetting(update.getSettingKey(), update.getSettingValue(), "GENERAL", "Auto-created setting", "STRING", adminId);
            }
        }
    }

    // Helper class for bulk updates
    public static class SystemSettingUpdateRequest {
        private String settingKey;
        private String settingValue;

        public SystemSettingUpdateRequest() {}

        public SystemSettingUpdateRequest(String settingKey, String settingValue) {
            this.settingKey = settingKey;
            this.settingValue = settingValue;
        }

        public String getSettingKey() { return settingKey; }
        public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

        public String getSettingValue() { return settingValue; }
        public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
    }
}