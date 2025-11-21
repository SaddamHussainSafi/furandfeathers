package com.furandfeathers.service;

import com.furandfeathers.entity.User;
import com.furandfeathers.enums.ActionType;
import com.furandfeathers.model.AdminAction;
import com.furandfeathers.repository.AdminActionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuditService {

    @Autowired
    private AdminActionRepository adminActionRepository;

    // Log admin action
    public AdminAction logAction(User admin, ActionType actionType, User targetUser,
                                String entityType, Long entityId, String description) {
        return logAction(admin, actionType, targetUser, entityType, entityId, description, null, null);
    }

    // Log admin action with old/new values
    public AdminAction logAction(User admin, ActionType actionType, User targetUser,
                                String entityType, Long entityId, String description,
                                String oldValue, String newValue) {
        AdminAction adminAction = new AdminAction();
        adminAction.setPerformedBy(admin);
        adminAction.setActionType(actionType);
        adminAction.setTargetUser(targetUser);
        
        // Set target entity based on type
        if ("PET".equals(entityType) && entityId != null) {
            adminAction.setTargetPetId(entityId);
        } else if ("ADOPTION".equals(entityType) && entityId != null) {
            adminAction.setTargetAdoptionId(entityId);
        }
        
        adminAction.setReason(description);
        
        // Store old/new values in details as JSON
        if (oldValue != null || newValue != null) {
            String details = String.format("{\"oldValue\":\"%s\",\"newValue\":\"%s\"}", 
                oldValue != null ? oldValue.replace("\"", "\\\"") : "", 
                newValue != null ? newValue.replace("\"", "\\\"") : "");
            adminAction.setDetails(details);
        }
        
        adminAction.setTimestamp(LocalDateTime.now());

        return adminActionRepository.save(adminAction);
    }

    // Log action with request details (IP, User Agent)
    public AdminAction logActionWithRequest(User admin, ActionType actionType, User targetUser,
                                           String entityType, Long entityId, String description,
                                           HttpServletRequest request) {
        AdminAction adminAction = logAction(admin, actionType, targetUser, entityType, entityId, description);

        if (request != null) {
            adminAction.setIpAddress(getClientIpAddress(request));
            adminAction.setUserAgent(request.getHeader("User-Agent"));
        }

        return adminActionRepository.save(adminAction);
    }

    // Get client IP address from request
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}