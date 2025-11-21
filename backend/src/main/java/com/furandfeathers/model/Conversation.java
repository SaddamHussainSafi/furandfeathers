package com.furandfeathers.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Conversation {
    private String id;
    @JsonProperty("user_input")
    private String userInput;
    @JsonProperty("expected_response")
    private String expectedResponse;
    private String context;
    @JsonProperty("next_context")
    private String nextContext;
    private String scenario;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserInput() { return userInput; }
    public void setUserInput(String userInput) { this.userInput = userInput; }

    public String getExpectedResponse() { return expectedResponse; }
    public void setExpectedResponse(String expectedResponse) { this.expectedResponse = expectedResponse; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }

    public String getNextContext() { return nextContext; }
    public void setNextContext(String nextContext) { this.nextContext = nextContext; }

    public String getScenario() { return scenario; }
    public void setScenario(String scenario) { this.scenario = scenario; }
}