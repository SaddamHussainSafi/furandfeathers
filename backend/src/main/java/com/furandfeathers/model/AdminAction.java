package com.furandfeathers.model;

import com.furandfeathers.enums.ActionType;
import com.furandfeathers.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_actions")
public class AdminAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType;

    @ManyToOne
    @JoinColumn(name = "performed_by", nullable = false)
    private User performedBy;

    @ManyToOne
    @JoinColumn(name = "target_user_id")
    private User targetUser;

    @Column(name = "target_pet_id")
    private Long targetPetId;

    @Column(name = "target_adoption_id")
    private Long targetAdoptionId;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details; // JSON for additional metadata

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // Constructors
    public AdminAction() {}

    public AdminAction(ActionType actionType, User performedBy) {
        this.actionType = actionType;
        this.performedBy = performedBy;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ActionType getActionType() { return actionType; }
    public void setActionType(ActionType actionType) { this.actionType = actionType; }

    public User getPerformedBy() { return performedBy; }
    public void setPerformedBy(User performedBy) { this.performedBy = performedBy; }

    public User getTargetUser() { return targetUser; }
    public void setTargetUser(User targetUser) { this.targetUser = targetUser; }

    public Long getTargetPetId() { return targetPetId; }
    public void setTargetPetId(Long targetPetId) { this.targetPetId = targetPetId; }

    public Long getTargetAdoptionId() { return targetAdoptionId; }
    public void setTargetAdoptionId(Long targetAdoptionId) { this.targetAdoptionId = targetAdoptionId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}