package com.furandfeathers.dto.request;

import com.furandfeathers.enums.UserRole;
import com.furandfeathers.enums.UserStatus;

public class UserRoleUpdateRequest {
    private UserRole role;
    private UserStatus status;

    // Constructors
    public UserRoleUpdateRequest() {}

    public UserRoleUpdateRequest(UserRole role, UserStatus status) {
        this.role = role;
        this.status = status;
    }

    // Getters and Setters
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
}