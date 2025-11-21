package com.furandfeathers.model;

import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonProperty;

public class DeepseekDataset {
    private String name;
    private String version;
    private String description;
    private List<Conversation> conversations;
    @JsonProperty("context_flow")
    private Map<String, String> contextFlow;
    @JsonProperty("pet_recommendations")
    private Map<String, List<String>> petRecommendations;
    private Metadata metadata;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Conversation> getConversations() { return conversations; }
    public void setConversations(List<Conversation> conversations) { this.conversations = conversations; }

    public Map<String, String> getContextFlow() { return contextFlow; }
    public void setContextFlow(Map<String, String> contextFlow) { this.contextFlow = contextFlow; }

    public Map<String, List<String>> getPetRecommendations() { return petRecommendations; }
    public void setPetRecommendations(Map<String, List<String>> petRecommendations) { this.petRecommendations = petRecommendations; }

    public Metadata getMetadata() { return metadata; }
    public void setMetadata(Metadata metadata) { this.metadata = metadata; }
}