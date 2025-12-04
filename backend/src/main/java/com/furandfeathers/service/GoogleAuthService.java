package com.furandfeathers.service;

import com.furandfeathers.entity.User;
import com.furandfeathers.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;

    @Value("${google.client.id}")
    private String googleClientId;

    private final org.springframework.web.reactive.function.client.WebClient webClient;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public GoogleAuthService(UserRepository userRepository,
            org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder) {
        this.userRepository = userRepository;
        this.webClient = webClientBuilder.build();
    }

    public Optional<User> verifyGoogleToken(String token) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken == null)
                return Optional.empty();

            GoogleIdToken.Payload payload = idToken.getPayload();
            return processUser(payload.getEmail(), (String) payload.get("name"), (String) payload.get("picture"));
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    public Optional<User> verifyAccessToken(String accessToken) {
        try {
            java.util.Map userInfo = webClient.get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .headers(h -> h.setBearerAuth(accessToken))
                    .retrieve()
                    .bodyToMono(java.util.Map.class)
                    .block();

            if (userInfo == null || userInfo.get("email") == null)
                return Optional.empty();

            return processUser(
                    (String) userInfo.get("email"),
                    (String) userInfo.get("name"),
                    (String) userInfo.get("picture"));
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    private Optional<User> processUser(String email, String name, String picture) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPicture(picture);
            newUser.setProvider("google");
            newUser.setRole(com.furandfeathers.enums.UserRole.ADOPTER);
            // Set a random encoded password to satisfy NOT NULL constraint for external logins
            newUser.setPassword(encoder.encode(UUID.randomUUID().toString()));
            return userRepository.save(newUser);
        });
        return Optional.of(user);
    }
}
