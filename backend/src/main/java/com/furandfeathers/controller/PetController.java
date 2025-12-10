package com.furandfeathers.controller;

import com.furandfeathers.entity.Pet;
import com.furandfeathers.dto.OwnerDTO;
import com.furandfeathers.dto.PetResponse;
import com.furandfeathers.dto.CommentDTO;
import com.furandfeathers.dto.LikeResponse;
import com.furandfeathers.dto.CommentRequest;
import com.furandfeathers.entity.User;
import com.furandfeathers.entity.Comment;
import com.furandfeathers.entity.Like;
import com.furandfeathers.entity.SavedPet;
import com.furandfeathers.repository.PetRepository;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.repository.CommentRepository;
import com.furandfeathers.repository.LikeRepository;
import com.furandfeathers.repository.SavedPetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = {
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private SavedPetRepository savedPetRepository;

    // Test endpoint to verify authentication
    @GetMapping("/test")
    public String whoAmI(Principal principal) {
        return "Logged in as: " + principal.getName();
    }

    // 1 Add new pet
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPet(
            @RequestPart("name") String name,
            @RequestPart("species") String species,
            @RequestPart("breed") String breed,
            @RequestPart("age") String age,
            @RequestPart("gender") String gender,
            @RequestPart("location") String location,
            @RequestPart("description") String description,
            @RequestPart(value = "status", required = false) String status,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Principal principal) throws IOException {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));

        String fileName = image != null ? UUID.randomUUID() + "_" + image.getOriginalFilename() : null;
        if (image != null) {
            Files.copy(image.getInputStream(), Paths.get(uploadDir + fileName), StandardCopyOption.REPLACE_EXISTING);
        }

        Pet pet = new Pet();
        pet.setName(name);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setAge(age);
        pet.setGender(gender);
        pet.setLocation(location);
        pet.setDescription(description);
        pet.setStatus(status != null ? status : "Available");
        pet.setImagePath(fileName != null ? uploadDir + fileName : null);
        pet.setImageUrl(fileName != null ? "/uploads/" + fileName : null);
        pet.setOwner(user);

        // Set listing status: only admin/superadmin auto-approve; everyone else requires review
        boolean isAdmin = user.getRole() == com.furandfeathers.enums.UserRole.ADMIN ||
                user.getRole() == com.furandfeathers.enums.UserRole.SUPERADMIN;
        pet.setListingStatus(isAdmin
                ? com.furandfeathers.enums.ListingStatus.APPROVED
                : com.furandfeathers.enums.ListingStatus.PENDING_REVIEW);

        petRepository.save(pet);
        return ResponseEntity.ok("Pet added successfully");
    }

    // 2 All pets (public)
    @GetMapping
    public List<PetResponse> getAllPets(@RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Boolean featured, Principal principal) {
        List<Pet> pets;

        // Check if user is authenticated and is admin/superadmin
        boolean isAdmin = false;
        if (principal != null) {
            Optional<User> userOpt = userRepository.findByEmail(principal.getName());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                isAdmin = user.getRole() == com.furandfeathers.enums.UserRole.ADMIN ||
                        user.getRole() == com.furandfeathers.enums.UserRole.SUPERADMIN;
            }
        }

        if (isAdmin) {
            pets = petRepository.findAllWithOwners();
        } else {
            pets = petRepository.findByListingStatus(com.furandfeathers.enums.ListingStatus.APPROVED);
        }

        if (limit != null && limit > 0) {
            pets = pets.stream().limit(limit).toList();
        }
        return pets.stream().map(pet -> toResponse(pet, principal)).toList();
    }

    // 2.1 Get pending pets (admin only)
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public List<PetResponse> getPendingPets(Principal principal) {
        List<Pet> pets = petRepository.findByListingStatus(com.furandfeathers.enums.ListingStatus.PENDING_REVIEW);
        return pets.stream().map(pet -> toResponse(pet, principal)).toList();
    }

    // 2.2 Approve pet (admin only)
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> approvePet(@PathVariable Long id, Principal principal) {
        User approver = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        if (pet.getListingStatus() != com.furandfeathers.enums.ListingStatus.PENDING_REVIEW) {
            return ResponseEntity.badRequest().body("Pet is not pending review");
        }

        // Prevent owners approving their own listings
        if (pet.getOwner() != null && pet.getOwner().getId().equals(approver.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot approve your own listing");
        }

        // Only approve shelter (or admin) listings; reject unknown roles
        if (pet.getOwner() != null &&
                pet.getOwner().getRole() != com.furandfeathers.enums.UserRole.SHELTER &&
                pet.getOwner().getRole() != com.furandfeathers.enums.UserRole.ADMIN) {
            return ResponseEntity.badRequest().body("Only shelter/admin listings can be approved");
        }

        // If the owner is ADMIN, require a different admin/superadmin to approve
        if (pet.getOwner() != null && pet.getOwner().getRole() == com.furandfeathers.enums.UserRole.ADMIN) {
            if (approver.getRole() == com.furandfeathers.enums.UserRole.ADMIN &&
                    pet.getOwner().getId().equals(approver.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Another admin must approve this listing");
            }
        }

        pet.setListingStatus(com.furandfeathers.enums.ListingStatus.APPROVED);
        petRepository.save(pet);

        return ResponseEntity.ok("Pet approved successfully");
    }

    // 2.3 Reject pet (admin only)
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> rejectPet(@PathVariable Long id, Principal principal) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        if (pet.getListingStatus() != com.furandfeathers.enums.ListingStatus.PENDING_REVIEW) {
            return ResponseEntity.badRequest().body("Pet is not pending review");
        }

        pet.setListingStatus(com.furandfeathers.enums.ListingStatus.REJECTED);
        petRepository.save(pet);

        return ResponseEntity.ok("Pet rejected");
    }

    // 2.5 Get single pet by ID
    @GetMapping("/{id}")
    public PetResponse getPetById(@PathVariable Long id, Principal principal) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        return toResponse(pet, principal);
    }

    // 2.6 Get single pet by name
    @GetMapping("/name/{name}")
    public PetResponse getPetByName(@PathVariable String name, Principal principal) {
        Pet pet = petRepository.findFirstByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        return toResponse(pet, principal);
    }

    // 3 Logged-in users pets
    @GetMapping("/my-pets")
    public List<PetResponse> getMyPets(Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Pet> pets = petRepository.findByOwner(user);
        return pets.stream().map(pet -> toResponse(pet, principal)).toList();
    }

    // helper to convert Pet -> PetResponse
    private PetResponse toResponse(Pet p, Principal principal) {
        OwnerDTO owner = null;
        if (p.getOwner() != null) {
            owner = new OwnerDTO(p.getOwner().getId(), p.getOwner().getName(), p.getOwner().getEmail(),
                    p.getOwner().getPicture());
        }

        boolean isSaved = false;
        if (principal != null) {
            Optional<User> userOpt = userRepository.findByEmail(principal.getName());
            if (userOpt.isPresent()) {
                isSaved = savedPetRepository.existsByUserIdAndPetId(userOpt.get().getId(), p.getId());
            }
        }

        return new PetResponse(
                p.getId(),
                p.getName(),
                p.getSpecies(),
                p.getBreed(),
                p.getAge(),
                p.getGender(),
                p.getLocation(),
                p.getDescription(),
                p.getStatus(),
                p.getImageUrl(),
                p.getImagePath(),
                p.getListingStatus().toString(),
                owner,
                null, // likes count
                false, // liked
                isSaved);
    }

    // 4 Update pet
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePet(
            @PathVariable Long id,
            @RequestPart("name") String name,
            @RequestPart("species") String species,
            @RequestPart("breed") String breed,
            @RequestPart("age") String age,
            @RequestPart("gender") String gender,
            @RequestPart("location") String location,
            @RequestPart("description") String description,
            @RequestPart(value = "status", required = false) String status,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Principal principal) throws IOException {

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRole() == com.furandfeathers.enums.UserRole.ADMIN ||
                user.getRole() == com.furandfeathers.enums.UserRole.SUPERADMIN;

        if (!pet.getOwner().getEmail().equals(principal.getName()) && !isAdmin)
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");

        pet.setName(name);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setAge(age);
        pet.setGender(gender);
        pet.setLocation(location);
        pet.setDescription(description);
        pet.setStatus(status != null ? status : pet.getStatus());

        if (image != null && !image.isEmpty()) {
            String uploadDir = "uploads/";
            Files.createDirectories(Paths.get(uploadDir));
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Files.copy(image.getInputStream(), Paths.get(uploadDir + fileName), StandardCopyOption.REPLACE_EXISTING);
            pet.setImagePath(uploadDir + fileName);
            pet.setImageUrl("/uploads/" + fileName);
        }

        petRepository.save(pet);
        return ResponseEntity.ok("Pet updated successfully");
    }

    // 5 Delete pet
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id, Principal principal) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRole() == com.furandfeathers.enums.UserRole.ADMIN ||
                user.getRole() == com.furandfeathers.enums.UserRole.SUPERADMIN;

        if (!pet.getOwner().getEmail().equals(principal.getName()) && !isAdmin)
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");

        petRepository.delete(pet);
        return ResponseEntity.ok("Pet deleted successfully");
    }

    // Like endpoints
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        Optional<Like> existingLike = likeRepository.findByPetIdAndUserId(id, user.getId());
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return ResponseEntity.ok("Like removed");
        } else {
            Like like = Like.builder()
                    .pet(pet)
                    .user(user)
                    .petUser(id + "_" + user.getId())
                    .build();
            likeRepository.save(like);
            return ResponseEntity.ok("Like added");
        }
    }

    @GetMapping("/{id}/likes")
    public ResponseEntity<?> getLikes(@PathVariable Long id, Principal principal) {
        long count = likeRepository.countByPetId(id);
        boolean liked = false;
        if (principal != null) {
            User user = userRepository.findByEmail(principal.getName()).orElse(null);
            if (user != null) {
                liked = likeRepository.findByPetIdAndUserId(id, user.getId()).isPresent();
            }
        }
        return ResponseEntity.ok(new LikeResponse(count, liked));
    }

    // Saved pet (favorites) endpoints
    @PostMapping("/{id}/save")
    public ResponseEntity<?> toggleSave(@PathVariable Long id, Principal principal) {
        try {
            if (savedPetRepository == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("SavedPetRepository not injected");
            }

            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Pet pet = petRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pet not found"));

            Optional<SavedPet> existingSaved = savedPetRepository.findByUserIdAndPetId(user.getId(), id);
            if (existingSaved.isPresent()) {
                savedPetRepository.delete(existingSaved.get());
                return ResponseEntity.ok("Pet removed from favorites");
            } else {
                SavedPet savedPet = new SavedPet(user, pet);
                savedPetRepository.save(savedPet);
                return ResponseEntity.ok("Pet added to favorites");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error toggling favorite: " + e.getMessage());
        }
    }

    @GetMapping("/saved")
    public ResponseEntity<?> getSavedPets(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<SavedPet> savedPets = savedPetRepository.findByUserIdOrderBySavedAtDesc(user.getId());
        List<PetResponse> petResponses = savedPets.stream()
                .map(savedPet -> {
                    Pet pet = savedPet.getPet();
                    return new PetResponse(
                            pet.getId(),
                            pet.getName(),
                            pet.getSpecies(),
                            pet.getBreed(),
                            pet.getAge(),
                            pet.getGender(),
                            pet.getLocation(),
                            pet.getDescription(),
                            pet.getStatus(),
                            pet.getImageUrl(),
                            pet.getImagePath(),
                            pet.getListingStatus().toString(),
                            new OwnerDTO(pet.getOwner().getId(), pet.getOwner().getName(), pet.getOwner().getEmail(),
                                    pet.getOwner().getPicture()),
                            null, // likes count - can be added later if needed
                            false, // liked - can be added later if needed
                            true // isSaved - since these are saved pets
                    );
                })
                .toList();

        return ResponseEntity.ok(petResponses);
    }

    // Comment endpoints
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody CommentRequest request,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        Comment comment = Comment.builder()
                .content(request.content)
                .createdAt(java.time.LocalDateTime.now())
                .pet(pet)
                .user(user)
                .build();
        commentRepository.save(comment);
        return ResponseEntity.ok("Comment added");
    }

    @GetMapping("/{id}/comments")
    public List<CommentDTO> getComments(@PathVariable Long id) {
        List<Comment> comments = commentRepository.findByPetIdOrderByCreatedAtDesc(id);
        return comments.stream().map(c -> new CommentDTO(
                c.getId(),
                c.getContent(),
                c.getCreatedAt(),
                new OwnerDTO(c.getUser().getId(), c.getUser().getName(), c.getUser().getEmail(),
                        c.getUser().getPicture())))
                .toList();
    }
}
