package com.furandfeathers.controller;

import com.furandfeathers.dto.furly.FurlyMessageRequest;
import com.furandfeathers.dto.furly.FurlyMessageResponse;
import com.furandfeathers.dto.furly.FurlySessionRequest;
import com.furandfeathers.dto.furly.FurlySessionResponse;
import com.furandfeathers.service.FurlyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/furly")
public class FurlyController {

    private final FurlyService furlyService;

    public FurlyController(FurlyService furlyService) {
        this.furlyService = furlyService;
    }

    @PostMapping("/session")
    public ResponseEntity<?> startSession(@RequestBody FurlySessionRequest request, Principal principal) {
        System.out.println("FurlyController: Received session request for intent: " + request.getIntent());
        if (principal != null) {
            System.out.println("FurlyController: User is authenticated: " + principal.getName());
        } else {
            System.out.println("FurlyController: Guest session");
        }

        try {
            long startTime = System.currentTimeMillis();
            FurlySessionResponse response = furlyService.startSession(request, principal);
            long duration = System.currentTimeMillis() - startTime;

            System.out.println("FurlyController: Session started successfully in " + duration + "ms. ID: "
                    + response.getConversationId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("FurlyController: Error starting session: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/message")
    public ResponseEntity<FurlyMessageResponse> sendMessage(@RequestBody FurlyMessageRequest request,
            Principal principal) {
        return ResponseEntity.ok(furlyService.handleMessage(request, principal));
    }
}
