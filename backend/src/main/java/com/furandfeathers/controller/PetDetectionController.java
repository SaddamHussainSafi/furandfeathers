package com.furandfeathers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.ParameterizedTypeReference;
import com.furandfeathers.entity.PetDetection;
import com.furandfeathers.repository.PetDetectionRepository;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class PetDetectionController {

    @Value("${google.api.key}")
    private String googleApiKey;

    @Autowired
    private PetDetectionRepository repo;

    private final String GEMINI_API_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    @PostMapping(value = "/pet-detect", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyzePet(@RequestParam("image") MultipartFile image)
            throws Exception {

        byte[] bytes = image.getBytes();
        String base64 = Base64.getEncoder().encodeToString(bytes);

        // Construct Gemini request body
        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mime_type", image.getContentType());
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

        // Send to Gemini
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                GEMINI_API_URL + googleApiKey, HttpMethod.POST, entity,
                new ParameterizedTypeReference<Map<String, Object>>() {});

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

    @GetMapping("/history")
    public ResponseEntity<List<PetDetection>> getDetectionHistory() {
        List<PetDetection> history = repo.findAll();
        return ResponseEntity.ok(history);
    }
}