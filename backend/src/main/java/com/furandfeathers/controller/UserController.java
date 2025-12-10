package com.furandfeathers.controller;

import com.furandfeathers.entity.User;
import com.furandfeathers.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PostMapping(value = "/me/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> updateProfilePicture(
            @RequestPart("picture") MultipartFile picture,
            Principal principal
    ) throws IOException {
        if (picture == null || picture.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Picture file is required");
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String uploadDir = "uploads/profile/";
        Files.createDirectories(Paths.get(uploadDir));

        String originalFileName = Optional.ofNullable(picture.getOriginalFilename()).orElse("avatar.png");
        String safeFileName = UUID.randomUUID() + "_" + originalFileName.replaceAll("\\s+", "_");
        Path destination = Paths.get(uploadDir + safeFileName);
        Files.copy(picture.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        user.setPicture("/" + uploadDir + safeFileName);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}
