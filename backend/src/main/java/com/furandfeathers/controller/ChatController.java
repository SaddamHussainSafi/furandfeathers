package com.furandfeathers.controller;

import com.furandfeathers.service.MistralService;
import com.furandfeathers.service.PetRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MistralService mistralService;

    @Autowired
    private PetRecommendationService recommendationService;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
        }

        var response = mistralService.chat(userMessage);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(@RequestBody Map<String, String> request) {
        String homeType = request.get("homeType");
        String activityLevel = request.get("activityLevel");
        String personality = request.get("personality");

        if (homeType == null || activityLevel == null || personality == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "homeType, activityLevel, and personality are required"));
        }

        var recommendations = recommendationService.getRecommendations(homeType, activityLevel, personality);
        return ResponseEntity.ok(Map.of("recommendations", recommendations));
    }
}