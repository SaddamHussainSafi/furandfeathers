package com.furandfeathers.repository;

import com.furandfeathers.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);

    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = ?1 AND n.isRead = false")
    Long countUnreadByRecipientId(Long recipientId);

    @Query("SELECT n FROM Notification n WHERE n.recipient.id = ?1 ORDER BY n.createdAt DESC")
    List<Notification> findRecentByRecipientId(Long recipientId, Pageable pageable);
}