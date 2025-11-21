package com.furandfeathers.controller;

import com.furandfeathers.entity.Pet;
import com.furandfeathers.repository.PetRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/furly")
public class FurlyController {

    private final WebClient webClient;
    private final PetRepository petRepository;
    
    // Simple in-memory session store (User ID -> History)
    private final Map<String, List<String>> conversationHistory = new ConcurrentHashMap<>();

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.model:mistral}")
    private String modelName;

    public FurlyController(WebClient.Builder webClientBuilder, PetRepository petRepository) {
        this.webClient = webClientBuilder.build();
        this.petRepository = petRepository;
    }

    @PostMapping("/reset")
    public ResponseEntity<?> reset(java.security.Principal principal) {
        String userId = (principal != null) ? principal.getName() : "guest-" + UUID.randomUUID().toString();
        conversationHistory.remove(userId);
        return ResponseEntity.ok(Map.of(
            "response", "Hi! I'm Furly, your AI adoption assistant. I can help you find the perfect pet. Tell me a bit about your home and lifestyle!", 
            "recommendations", List.of()
        ));
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> input, java.security.Principal principal) {
        String userMessageText = input.get("message");
        String userId = (principal != null) ? principal.getName() : "guest"; 

        if (userMessageText == null || userMessageText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
        }

        // 1. Prepare Context (Available Pets)
        String petContext = getAvailablePetsContext();
        String systemPrompt = String.format("""
            You are Furly, an intelligent pet adoption assistant.
            Your goal is to match the user with one of the available pets listed below.
            
            AVAILABLE PETS:
            %s
            
            INSTRUCTIONS:
            1. Ask friendly questions to understand the user's living situation, activity level, and preferences.
            2. Do not recommend a pet immediately. Gather information first (at least 2-3 turns).
            3. When you recommend a pet, mention it by name and explain why it's a good match.
            4. If you recommend pets, end your response with a special block:
               MATCHES: [ID1, ID2, ...]
               (e.g., MATCHES: [1, 5])
            5. Be concise and empathetic.
            """, petContext);

        // 2. Manage History
        List<String> history = conversationHistory.computeIfAbsent(userId, k -> new ArrayList<>());
        history.add("User: " + userMessageText);

        // 3. Build input for GPT2
        String conversationHistory = String.join("\n", history);
        String fullInput = systemPrompt + "\n" + conversationHistory + "\nFurly:";

        // 4. Call Hugging Face API
        String aiResponse;
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("prompt", fullInput);
            requestBody.put("stream", false);

            var requestSpec = webClient.post()
                    .uri(apiUrl)
                    .header("Content-Type", "application/json");

            if (StringUtils.hasText(apiKey)) {
                requestSpec = requestSpec.header("Authorization", "Bearer " + apiKey);
            }

            Map<String, Object> response = requestSpec
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null) {
                Object generatedText = response.get("response");
                if (generatedText instanceof String text && !text.isBlank()) {
                    aiResponse = text.trim();
                } else {
                    aiResponse = "I'm sorry, I couldn't generate a response right now.";
                }
            } else {
                aiResponse = "I'm sorry, I couldn't generate a response right now.";
            }
        } catch (WebClientResponseException e) {
            System.err.println("Hugging Face API Error: " + e.getStatusCode().value() + " " + e.getStatusText());
            System.err.println("Response body: " + e.getResponseBodyAsString());
            e.printStackTrace();
            // Remove the last user message
            if (!history.isEmpty()) {
                history.remove(history.size() - 1);
            }
            return ResponseEntity.ok(Map.of("response", "Our AI helper is unavailable at the moment. Please try again shortly!"));
        } catch (Exception e) {
            // Log the actual error for debugging
            System.err.println("Hugging Face API Error: " + e.getMessage());
            e.printStackTrace();
            // Remove the last user message
            if (!history.isEmpty()) {
                history.remove(history.size() - 1);
            }
            return ResponseEntity.ok(Map.of("response", "I'm having trouble connecting to the server right now. Please try again in a moment!"));
        }

        // 5. Process Response
        history.add("Furly: " + aiResponse);
        
        // Extract Recommendations
        List<Map<String, Object>> recommendations = new ArrayList<>();
        String cleanResponse = aiResponse;
        if (aiResponse.contains("MATCHES: [")) {
            try {
                int startIndex = aiResponse.lastIndexOf("MATCHES: [");
                int endIndex = aiResponse.indexOf("]", startIndex);
                if (endIndex > startIndex) {
                    String idsStr = aiResponse.substring(startIndex + 10, endIndex);
                    cleanResponse = aiResponse.substring(0, startIndex).trim();
                    
                    String[] ids = idsStr.split(",");
                    for (String id : ids) {
                        try {
                            Long petId = Long.parseLong(id.trim());
                            petRepository.findById(petId).ifPresent(p -> recommendations.add(mapPetToResponse(p)));
                        } catch (NumberFormatException e) {
                            // ignore
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to parse matches: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(Map.of("response", cleanResponse, "recommendations", recommendations));
    }

    private String getAvailablePetsContext() {
        return petRepository.findAllWithOwners().stream()
                .filter(p -> p.getStatus() != null && "Available".equalsIgnoreCase(p.getStatus()))
                .map(p -> String.format("- ID: %d, Name: %s, Species: %s, Breed: %s, Age: %s, Temperament: %s", 
                        p.getId(), p.getName(), p.getSpecies(), p.getBreed(), p.getAge(), p.getDescription()))
                .collect(Collectors.joining("\n"));
    }

    private Map<String, Object> mapPetToResponse(Pet p) {
        Map<String, Object> obj = new HashMap<>();
        obj.put("id", p.getId());
        obj.put("name", p.getName());
        obj.put("breed", p.getBreed());
        obj.put("age", p.getAge());
        obj.put("location", p.getLocation());
        obj.put("description", p.getDescription());
        obj.put("imageUrl", p.getImageUrl());
        return obj;
    }
}
