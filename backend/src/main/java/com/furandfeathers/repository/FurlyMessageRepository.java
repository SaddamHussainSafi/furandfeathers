package com.furandfeathers.repository;

import com.furandfeathers.entity.FurlyMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FurlyMessageRepository extends JpaRepository<FurlyMessage, Long> {

    List<FurlyMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    List<FurlyMessage> findTop20ByConversationIdOrderByCreatedAtDesc(Long conversationId);
}
