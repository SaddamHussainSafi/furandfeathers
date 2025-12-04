package com.furandfeathers.repository;

import com.furandfeathers.entity.FurlyConversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FurlyConversationRepository extends JpaRepository<FurlyConversation, Long> {

    Optional<FurlyConversation> findByIdAndUserId(Long id, Long userId);

    Optional<FurlyConversation> findByIdAndGuestSessionId(Long id, String guestSessionId);

    List<FurlyConversation> findByUserIdOrderByUpdatedAtDesc(Long userId);
}
