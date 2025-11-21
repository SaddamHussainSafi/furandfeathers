package com.furandfeathers.dto.request;

import com.furandfeathers.enums.ListingStatus;

public class PetApprovalRequest {
    private ListingStatus status;
    private String rejectionReason;

    // Constructors
    public PetApprovalRequest() {}

    public PetApprovalRequest(ListingStatus status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    // Getters and Setters
    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}