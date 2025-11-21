package com.furandfeathers.dto.request;

import lombok.Data;

@Data
public class AdoptionStatusUpdateRequest {
    private String status;
    private String adminNotes;
    private String rejectionReason;
}
