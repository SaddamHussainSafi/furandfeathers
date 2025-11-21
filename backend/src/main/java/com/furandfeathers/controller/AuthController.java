package com.furandfeathers.controller;

import com.furandfeathers.entity.User;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.service.GoogleAuthService;
import com.furandfeathers.service.JwtService;
import com.furandfeathers.enums.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
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
    public Map<String, Object> signup(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        if (userRepository.findByEmail(email).isPresent()) {
            return Map.of("status", "error", "message", "Email already exists");
        }

        // --- get and validate role ---
        String roleString = req.getOrDefault("role", "SHELTER").toUpperCase();
        if (!roleString.equals("ADOPTER") && !roleString.equals("SHELTER")) {
            roleString = "SHELTER"; // fallback if someone sends something else
        }
        UserRole role = UserRole.valueOf(roleString);

        User user = User.builder()
            .name(req.get("name"))
            .email(email)
            .password(encoder.encode(req.get("password")))
            .provider("local")
            .role(role)
            .build();

        userRepository.save(user);
    // ensure role claim is a simple string so JWT payload is predictable for frontend
    String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().toString()));

        return Map.of("status", "success", "token", token, "user", user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String password = req.get("password");

        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty()) return Map.of("status", "error", "message", "User not found");

        User user = optUser.get();
        if (!encoder.matches(password, user.getPassword()))
            return Map.of("status", "error", "message", "Invalid credentials");
        String token = jwtService.generateToken(email, Map.of("role", user.getRole().toString()));
        return Map.of("status", "success", "token", token, "user", user);
    }

    @PostMapping("/google")
    public Map<String, Object> googleLogin(@RequestBody Map<String, String> req) {
        return googleAuthService.verifyGoogleToken(req.get("idToken"))
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
