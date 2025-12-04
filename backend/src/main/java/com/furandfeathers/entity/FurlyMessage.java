package com.furandfeathers.entity;

import com.furandfeathers.enums.FurlyMessageSender;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "furly_messages")
public class FurlyMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    private FurlyConversation conversation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FurlyMessageSender sender;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public FurlyConversation getConversation() {
        return conversation;
    }

    public void setConversation(FurlyConversation conversation) {
        this.conversation = conversation;
    }

    public FurlyMessageSender getSender() {
        return sender;
    }

    public void setSender(FurlyMessageSender sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
