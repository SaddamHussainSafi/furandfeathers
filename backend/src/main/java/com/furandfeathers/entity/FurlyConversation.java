package com.furandfeathers.entity;

import com.furandfeathers.enums.FurlyIntent;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "furly_conversations")
public class FurlyConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "guest_session_id")
    private String guestSessionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FurlyIntent intent;

    @Column(name = "step_index")
    private int stepIndex;

    @Column(name = "completed")
    private boolean completed;

    @Lob
    @Column(name = "context_json", columnDefinition = "TEXT")
    private String contextJson;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
        if (this.contextJson == null) {
            this.contextJson = "{}";
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getGuestSessionId() {
        return guestSessionId;
    }

    public void setGuestSessionId(String guestSessionId) {
        this.guestSessionId = guestSessionId;
    }

    public FurlyIntent getIntent() {
        return intent;
    }

    public void setIntent(FurlyIntent intent) {
        this.intent = intent;
    }

    public int getStepIndex() {
        return stepIndex;
    }

    public void setStepIndex(int stepIndex) {
        this.stepIndex = stepIndex;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getContextJson() {
        return contextJson;
    }

    public void setContextJson(String contextJson) {
        this.contextJson = contextJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
