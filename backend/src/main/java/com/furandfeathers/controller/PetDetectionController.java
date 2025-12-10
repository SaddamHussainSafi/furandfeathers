package com.furandfeathers.controller;

import com.furandfeathers.entity.PetDetection;
import com.furandfeathers.repository.PetDetectionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class PetDetectionController {

    private static final Logger log = LoggerFactory.getLogger(PetDetectionController.class);

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta}")
    private String geminiApiUrl;

    @Value("${gemini.model:gemini-2.5-flash-lite}")
    private String geminiModel;

    @Autowired
    private PetDetectionRepository repo;

    @PostMapping(value = "/pet-detect", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyzePet(@RequestParam("image") MultipartFile image)
            throws Exception {

        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "Image is required"));
        }

        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            log.error("Gemini API key is missing; set gemini.api.key in configuration.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "AI detection is not configured."));
        }

        byte[] bytes = image.getBytes();
        String base64 = Base64.getEncoder().encodeToString(bytes);

        // Construct Gemini request body
        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mime_type", image.getContentType() != null ? image.getContentType() : "image/jpeg");
        inlineData.put("data", base64);

        Map<String, Object> userPart = new HashMap<>();
        userPart.put("text",
                "You are an expert veterinarian AI. Describe the pet in this photo in detail. Include species, "
                        + "probable breed, approximate age, color, fur length/type, size, gender if guessable, "
                        + "and emotional state. Also note any distinctive features.");

        Map<String, Object> part = new HashMap<>();
        part.put("inline_data", inlineData);

        List<Object> parts = Arrays.asList(userPart, part);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(Collections.singletonMap("parts", parts)));

        String endpoint = String.format(
                "%s/models/%s:generateContent?key=%s",
                geminiApiUrl.replaceAll("/+$", ""),
                geminiModel,
                geminiApiKey
        );

        ResponseEntity<Map<String, Object>> response;
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            response = restTemplate.exchange(
                    endpoint,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {});
        } catch (HttpStatusCodeException ex) {
            String apiMessage = extractApiMessage(ex.getResponseBodyAsString());
            log.error("Gemini API returned {}: {}", ex.getStatusCode(), apiMessage);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Collections.singletonMap(
                            "error",
                            apiMessage != null && !apiMessage.isBlank()
                                    ? apiMessage
                                    : "AI detection service error. Please try again later."));
        } catch (Exception ex) {
            log.error("Gemini API call failed", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "AI detection service unavailable."));
        }

        // Parse response text
        String outputText = "";
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                @SuppressWarnings("unchecked")
                Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                if (content != null) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) content.get("parts");
                    if (partsList != null && !partsList.isEmpty()) {
                        Map<String, Object> firstPart = partsList.get(0);
                        outputText = (String) firstPart.get("text");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed parsing Gemini response", e);
            outputText = "Could not parse Gemini response.";
        }

        // Save to database
        PetDetection record = new PetDetection();
        record.setImageUrl("upload not stored yet");
        record.setAnalysis(outputText);
        repo.save(record);

        Map<String, Object> result = new HashMap<>();
        result.put("analysis", outputText);
        return ResponseEntity.ok(result);
    }

    private String extractApiMessage(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) return null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseBody);
            JsonNode error = root.path("error");
            if (error.hasNonNull("message")) {
                return error.get("message").asText();
            }
        } catch (Exception ignored) {
            // If parsing fails, just return raw message.
        }
        return responseBody;
    }

    @GetMapping("/history")
    public ResponseEntity<List<PetDetection>> getDetectionHistory() {
        List<PetDetection> history = repo.findAll();
        return ResponseEntity.ok(history);
    }
}
