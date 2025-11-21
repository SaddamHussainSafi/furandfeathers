package com.furandfeathers.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Metadata {
    @JsonProperty("total_conversations")
    private int totalConversations;
    @JsonProperty("contexts_covered")
    private int contextsCovered;
    @JsonProperty("scenarios_covered")
    private int scenariosCovered;
    @JsonProperty("last_updated")
    private String lastUpdated;
    @JsonProperty("training_size")
    private String trainingSize;

    // Getters and setters
    public int getTotalConversations() { return totalConversations; }
    public void setTotalConversations(int totalConversations) { this.totalConversations = totalConversations; }

    public int getContextsCovered() { return contextsCovered; }
    public void setContextsCovered(int contextsCovered) { this.contextsCovered = contextsCovered; }

    public int getScenariosCovered() { return scenariosCovered; }
    public void setScenariosCovered(int scenariosCovered) { this.scenariosCovered = scenariosCovered; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }

    public String getTrainingSize() { return trainingSize; }
    public void setTrainingSize(String trainingSize) { this.trainingSize = trainingSize; }
}