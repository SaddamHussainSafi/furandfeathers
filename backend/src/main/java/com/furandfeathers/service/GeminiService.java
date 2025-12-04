package com.furandfeathers.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.netty.http.client.HttpClient;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta}")
    private String apiBaseUrl;

    @Value("${gemini.model:gemini-2.5-flash-lite}")
    private String modelName;

    @Value("${gemini.timeout.seconds:20}")
    private int geminiTimeoutSeconds;

    public GeminiService(WebClient.Builder webClientBuilder) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5_000)
                .responseTimeout(Duration.ofSeconds(20))
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(20))
                        .addHandlerLast(new WriteTimeoutHandler(20)));

        this.webClient = webClientBuilder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    public Map<String, Object> chat(String userMessage) {
        if (!StringUtils.hasText(userMessage)) {
            return Map.of("response", "Please share a question so I can help!");
        }

        String systemPrompt = "You are a helpful pet adoption assistant. Keep responses friendly and concise.";
        String prompt = "User: " + userMessage.trim() + "\nAssistant:";

        try {
            String response = generateContent(systemPrompt, prompt);
            return Map.of("response", response);
        } catch (GeminiServiceException e) {
            System.err.println("Gemini chat failure: " + e.getMessage());
            return Map.of("response", "Our AI helper is unavailable at the moment. Please try again shortly!");
        }
    }

    public String generateContent(String systemPrompt, String prompt) {
        if (!StringUtils.hasText(prompt)) {
            throw new GeminiServiceException("Prompt is required for Gemini requests.");
        }

        if (!StringUtils.hasText(apiKey)) {
            throw new GeminiServiceException("Gemini API key is not configured.");
        }

        Map<String, Object> requestBody = buildRequestBody(systemPrompt, prompt);
        String endpoint = buildEndpoint();

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.post()
                    .uri(endpoint)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block(Duration.ofSeconds(Math.max(5, geminiTimeoutSeconds)));

            return extractText(response)
                    .filter(StringUtils::hasText)
                    .map(String::trim)
                    .orElse("I'm sorry, I couldn't generate a response right now.");
        } catch (WebClientResponseException e) {
            System.err.println("Gemini API Error: " + e.getStatusCode().value() + " " + e.getStatusText());
            System.err.println("Response body: " + e.getResponseBodyAsString());
            throw new GeminiServiceException("Gemini API error: " + e.getStatusCode(), e);
        } catch (Exception e) {
            throw new GeminiServiceException("Failed to contact Gemini API", e);
        }
    }

    private Map<String, Object> buildRequestBody(String systemPrompt, String prompt) {
        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", List.of(Map.of("text", prompt)));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(userContent));

        if (StringUtils.hasText(systemPrompt)) {
            requestBody.put("system_instruction", Map.of(
                    "parts", List.of(Map.of("text", systemPrompt))
            ));
        }

        return requestBody;
    }

    private String buildEndpoint() {
        String baseUrl = StringUtils.hasText(apiBaseUrl) ? apiBaseUrl : "https://generativelanguage.googleapis.com/v1beta";
        while (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        return baseUrl + "/models/" + modelName + ":generateContent?key=" + apiKey;
    }

    @SuppressWarnings("unchecked")
    private Optional<String> extractText(Map<String, Object> response) {
        if (response == null) {
            return Optional.empty();
        }

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            return Optional.empty();
        }

        for (Map<String, Object> candidate : candidates) {
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            if (content == null) {
                continue;
            }

            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null) {
                continue;
            }

            for (Map<String, Object> part : parts) {
                Object text = part.get("text");
                if (text instanceof String s && StringUtils.hasText(s)) {
                    return Optional.of(s);
                }
            }
        }

        return Optional.empty();
    }

    public static class GeminiServiceException extends RuntimeException {
        public GeminiServiceException(String message) {
            super(message);
        }

        public GeminiServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
