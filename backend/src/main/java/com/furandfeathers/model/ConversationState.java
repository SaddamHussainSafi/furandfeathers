package com.furandfeathers.model;

import java.util.HashMap;
import java.util.Map;

public class ConversationState {
    private String step = "welcome";
    private int stepCount = 0;
    private final Map<String, String> answers = new HashMap<>();

    public void updateState(String input, String context) {
        answers.put(context, input);
        stepCount++;
    }

    public boolean isReadyForRecommendation() {
        return stepCount >= 5;
    }

    public void reset() {
        this.step = "welcome";
        this.stepCount = 0;
        this.answers.clear();
    }

    public Map<String, String> getAnswers() {
        return answers;
    }

    public String getStep() {
        return step;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public int getStepCount() {
        return stepCount;
    }
}