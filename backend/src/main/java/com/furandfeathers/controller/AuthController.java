package com.furandfeathers.controller;

import com.furandfeathers.dto.SignupRequest;
import com.furandfeathers.entity.User;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.service.GoogleAuthService;
import com.furandfeathers.service.JwtService;
import com.furandfeathers.enums.UserRole;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
public class AuthController {

    private final UserRepository userRepository;
    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, GoogleAuthService googleAuthService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.googleAuthService = googleAuthService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> validationErrors = bindingResult.getFieldErrors().stream()
                    .collect(
                            LinkedHashMap::new,
                            (acc, error) -> acc.putIfAbsent(error.getField(), error.getDefaultMessage()),
                            LinkedHashMap::putAll);
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Validation failed",
                    "errors", validationErrors));
        }

        String email = req.email().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("status", "error", "message", "Email already exists"));
        }

        String roleString = req.role().trim().toUpperCase(Locale.ROOT);
        UserRole role = UserRole.valueOf(roleString);

        User user = User.builder()
                .name(req.name().trim().replaceAll("\\s+", " "))
                .email(email)
                .password(encoder.encode(req.password()))
                .provider("local")
                .role(role)
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().toString()));

        return ResponseEntity.ok(Map.of("status", "success", "token", token, "user", user));
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String password = req.get("password");

        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty())
            return Map.of("status", "error", "message", "User not found");

        User user = optUser.get();
        if (!encoder.matches(password, user.getPassword()))
            return Map.of("status", "error", "message", "Invalid credentials");
        String token = jwtService.generateToken(email, Map.of("role", user.getRole().toString()));
        return Map.of("status", "success", "token", token, "user", user);
    }

    @PostMapping("/google")
    public Map<String, Object> googleLogin(@RequestBody Map<String, String> req) {
        Optional<User> userOpt;
        if (req.containsKey("idToken")) {
            userOpt = googleAuthService.verifyGoogleToken(req.get("idToken"));
        } else if (req.containsKey("accessToken")) {
            userOpt = googleAuthService.verifyAccessToken(req.get("accessToken"));
        } else {
            return Map.of("status", "error", "message", "Missing token");
        }

        return userOpt
                .map(user -> Map.of(
                        "status", "success",
                        "token", jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().toString())),
                        "user", user))
                .orElse(Map.of("status", "error", "message", "Google authentication failed"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(user);
    }
}
