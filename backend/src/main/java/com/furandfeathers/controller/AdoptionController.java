package com.furandfeathers.controller;

import com.furandfeathers.dto.request.AdoptionApplicationRequest;
import com.furandfeathers.dto.request.AdoptionStatusUpdateRequest;
import com.furandfeathers.dto.response.AdoptionApplicationResponse;
import com.furandfeathers.service.AdoptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/adoptions")
public class AdoptionController {

    private final AdoptionService adoptionService;

    public AdoptionController(AdoptionService adoptionService) {
        this.adoptionService = adoptionService;
    }

    @PostMapping
    public ResponseEntity<AdoptionApplicationResponse> submitApplication(
            @RequestBody AdoptionApplicationRequest request,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        AdoptionApplicationResponse response = adoptionService.submitApplication(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<AdoptionApplicationResponse>> getMyApplications(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(adoptionService.getMyApplications(principal.getName()));
    }

    @GetMapping("/manage")
    public ResponseEntity<List<AdoptionApplicationResponse>> getManageableApplications(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(adoptionService.getManageableApplications(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdoptionApplicationResponse> getApplicationDetail(
            @PathVariable Long id,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(adoptionService.getApplicationDetail(id, principal.getName()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AdoptionApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody AdoptionStatusUpdateRequest request,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(adoptionService.updateStatus(id, request, principal.getName()));
    }
}
