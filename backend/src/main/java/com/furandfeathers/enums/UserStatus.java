package com.furandfeathers.enums;

public enum UserStatus {
    ACTIVE,      // Account is active and can use platform
    SUSPENDED,   // Account temporarily suspended by admin
    PENDING,     // Account awaiting approval (for shelters)
    REJECTED     // Account registration rejected
}