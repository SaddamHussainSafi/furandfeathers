package com.furandfeathers.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class FurlyTrainingService {
    private JSONObject dataset;
    private Map<String, String> contextFlow;
    private JSONArray conversations;
    private JSONObject petRecommendations;

    @PostConstruct
    public void init() throws IOException {
        InputStream input = getClass().getResourceAsStream("/deepseek_json_20251029_b120bf.json");
        if (input == null) {
            throw new IOException("Training data file not found");
        }
        String jsonString = new String(input.readAllBytes(), StandardCharsets.UTF_8);
        dataset = new JSONObject(jsonString);
        contextFlow = new HashMap<>();
        JSONObject flowObj = dataset.optJSONObject("context_flow");
        if (flowObj != null) {
            for (String key : flowObj.keySet()) {
                contextFlow.put(key, flowObj.getString(key));
            }
        }
        conversations = dataset.optJSONArray("conversations");
        if (conversations == null) {
            conversations = new JSONArray();
        }
        petRecommendations = dataset.optJSONObject("pet_recommendations");
        if (petRecommendations == null) {
            petRecommendations = new JSONObject();
        }
    }

    public String getNextContext(String currentContext) {
        return contextFlow.getOrDefault(currentContext, "recommendation");
    }

    public JSONArray getConversations() {
        return conversations;
    }

    public JSONObject getPetRecommendations() {
        return petRecommendations;
    }

    public String findResponseForContext(String context) {
        for (int i = 0; i < conversations.length(); i++) {
            JSONObject conv = conversations.getJSONObject(i);
            if (context.equals(conv.optString("context"))) {
                return conv.optString("expected_response", "");
            }
        }
        return "Could you tell me more about your preferences?";
    }
}