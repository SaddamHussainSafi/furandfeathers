package com.furandfeathers.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.*;

@Service
public class MistralService {

    private final WebClient webClient;

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.model:mistral}")
    private String modelName;

    public MistralService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Map<String, Object> chat(String userMessage) {
        try {
            String systemPrompt = "You are a helpful pet adoption assistant. Keep responses friendly and concise.";
            String fullInput = systemPrompt + "\nUser: " + userMessage + "\nAssistant:";

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
                    String content = text.trim();
                    return Map.of("response", content);
                }
            }
            return Map.of("response", "I'm sorry, I couldn't generate a response right now.");
        } catch (WebClientResponseException e) {
            System.err.println("Hugging Face API Error: " + e.getStatusCode().value() + " " + e.getStatusText());
            System.err.println("Response body: " + e.getResponseBodyAsString());
            e.printStackTrace();
            return Map.of("response", "Our AI helper is unavailable at the moment. Please try again shortly!");
        } catch (Exception e) {
            System.err.println("Hugging Face API Error: " + e.getMessage());
            e.printStackTrace();
            return Map.of("response", "I'm having trouble connecting to the server right now. Please try again in a moment!");
        }
    }
}
