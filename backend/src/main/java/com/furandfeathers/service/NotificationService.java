package com.furandfeathers.service;

import com.furandfeathers.entity.User;
import com.furandfeathers.enums.NotificationType;
import com.furandfeathers.model.Notification;
import com.furandfeathers.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Send notification to a user
    public Notification sendNotification(User user, NotificationType type, String title, String message) {
        Notification notification = new Notification();
        notification.setRecipient(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    // Get notifications for a user
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findRecentByRecipientId(userId, Pageable.unpaged());
    }

    // Get unread notifications count for a user
    public Long getUnreadNotificationsCount(Long userId) {
        return notificationRepository.countUnreadByRecipientId(userId);
    }

    // Mark notification as read
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    // Mark all notifications as read for a user
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    // Delete notification
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // Send system notification to all users with specific role
    public void sendSystemNotification(String role, NotificationType type, String title, String message) {
        // This would require a custom query to find users by role
        // For now, this is a placeholder
    }
}