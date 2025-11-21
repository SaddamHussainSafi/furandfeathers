package com.furandfeathers.dto.request;

import com.furandfeathers.enums.ApprovalStatus;

public class ShelterApprovalRequest {
    private ApprovalStatus status;
    private String rejectionReason;

    // Constructors
    public ShelterApprovalRequest() {}

    public ShelterApprovalRequest(ApprovalStatus status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    // Getters and Setters
    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}