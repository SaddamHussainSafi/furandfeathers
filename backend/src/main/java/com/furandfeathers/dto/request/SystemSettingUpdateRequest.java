package com.furandfeathers.dto.request;

public class SystemSettingUpdateRequest {
    private String settingValue;

    // Constructors
    public SystemSettingUpdateRequest() {}

    public SystemSettingUpdateRequest(String settingValue) {
        this.settingValue = settingValue;
    }

    // Getters and Setters
    public String getSettingValue() { return settingValue; }
    public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
}