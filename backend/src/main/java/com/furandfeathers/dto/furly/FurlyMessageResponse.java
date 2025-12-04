package com.furandfeathers.dto.furly;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Collections;
import java.util.List;

public class FurlyMessageResponse {

    @JsonProperty("conversationId")
    private Long conversationId;

    @JsonProperty("message")
    private String message;

    @JsonProperty("quickReplies")
    private List<String> quickReplies;

    @JsonProperty("recommendations")
    private List<FurlyRecommendation> recommendations;

    @JsonProperty("completed")
    private boolean completed;

    public FurlyMessageResponse() {}

    public FurlyMessageResponse(Long conversationId,
                                String message,
                                List<String> quickReplies,
                                List<FurlyRecommendation> recommendations,
                                boolean completed) {
        this.conversationId = conversationId;
        this.message = message;
        this.quickReplies = quickReplies == null ? Collections.emptyList() : quickReplies;
        this.recommendations = recommendations == null ? Collections.emptyList() : recommendations;
        this.completed = completed;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getQuickReplies() {
        return quickReplies;
    }

    public List<FurlyRecommendation> getRecommendations() {
        return recommendations;
    }

    public boolean isCompleted() {
        return completed;
    }
}
