package com.furandfeathers.dto.furly;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.furandfeathers.enums.FurlyIntent;

import java.util.List;

public class FurlySessionResponse {

    @JsonProperty("conversationId")
    private Long conversationId;

    @JsonProperty("guestSessionId")
    private String guestSessionId;

    @JsonProperty("openingMessage")
    private String openingMessage;

    @JsonProperty("quickReplies")
    private List<String> quickReplies;

    @JsonProperty("intent")
    private FurlyIntent intent;

    public FurlySessionResponse() {}

    public FurlySessionResponse(Long conversationId, String guestSessionId, String openingMessage,
                                List<String> quickReplies, FurlyIntent intent) {
        this.conversationId = conversationId;
        this.guestSessionId = guestSessionId;
        this.openingMessage = openingMessage;
        this.quickReplies = quickReplies;
        this.intent = intent;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public String getGuestSessionId() {
        return guestSessionId;
    }

    public String getOpeningMessage() {
        return openingMessage;
    }

    public List<String> getQuickReplies() {
        return quickReplies;
    }

    public FurlyIntent getIntent() {
        return intent;
    }
}
