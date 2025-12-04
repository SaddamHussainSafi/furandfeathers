package com.furandfeathers.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.furandfeathers.config.JwtAuthenticationFilter;
import com.furandfeathers.entity.Pet;
import com.furandfeathers.entity.User;
import com.furandfeathers.enums.ListingStatus;
import com.furandfeathers.enums.UserRole;
import com.furandfeathers.repository.*;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.security.Principal;
import java.util.Optional;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PetController.class)
public class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private PetRepository petRepository;
    @MockBean private UserRepository userRepository;
    @MockBean private CommentRepository commentRepository;
    @MockBean private LikeRepository likeRepository;
    @MockBean private SavedPetRepository savedPetRepository;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;

    private Principal mockPrincipal(String email) {
        return () -> email;
    }

    private User mockUser() {
        User u = new User();
        u.setId(1L);
        u.setName("Saddam");
        u.setEmail("test@example.com");
        u.setRole(UserRole.ADMIN);
        return u;
    }

    private Pet mockPet() {
        Pet p = new Pet();
        p.setId(10L);
        p.setName("Milo");
        p.setSpecies("Cat");
        p.setBreed("Persian");
        p.setListingStatus(ListingStatus.APPROVED);
        p.setOwner(mockUser());
        return p;
    }

    // ------------------------------------------
    // TEST: Add new pet
    // ------------------------------------------
    @Test
    void testAddPet_success() throws Exception {
        Mockito.when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(mockUser()));

        MockMultipartFile image = new MockMultipartFile(
            "image", "cat.jpg", "image/jpeg", "fake-image-data".getBytes()
        );

        mockMvc.perform(multipart("/api/pets")
                .file(image)
                .param("name", "Milo")
                .param("species", "Cat")
                .param("breed", "Persian")
                .param("age", "2")
                .param("gender", "Male")
                .param("location", "Toronto")
                .param("description", "Cute cat")
                .principal(mockPrincipal("test@example.com"))
            ).andExpect(status().isOk())
            .andExpect(content().string("Pet added successfully"));
    }

    // ------------------------------------------
    // TEST: Fetch all pets (admin sees all)
    // ------------------------------------------
    @Test
    void testGetAllPets_admin() throws Exception {
        User admin = mockUser();
        admin.setRole(UserRole.ADMIN);

        Mockito.when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(admin));

        Mockito.when(petRepository.findAllWithOwners())
            .thenReturn(List.of(mockPet()));

        mockMvc.perform(get("/api/pets")
                .principal(mockPrincipal("test@example.com"))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Milo"));
    }

    // ------------------------------------------
    // TEST: Get pet by ID
    // ------------------------------------------
    @Test
    void testGetPetById() throws Exception {
        Mockito.when(petRepository.findById(10L)).thenReturn(Optional.of(mockPet()));

        mockMvc.perform(get("/api/pets/10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Milo"));
    }

    // ------------------------------------------
    // TEST: Toggle Like
    // ------------------------------------------
    @Test
    void testToggleLike_addLike() throws Exception {
        Mockito.when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(mockUser()));
        Mockito.when(petRepository.findById(10L))
            .thenReturn(Optional.of(mockPet()));
        Mockito.when(likeRepository.findByPetIdAndUserId(10L, 1L))
            .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/pets/10/like")
                .principal(mockPrincipal("test@example.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("Like added"));
    }

    // ------------------------------------------
    // TEST: Delete pet (only owner allowed)
    // ------------------------------------------
    @Test
    void testDeletePet_unauthorized() throws Exception {
        Pet p = mockPet();
        p.getOwner().setEmail("someoneElse@mail.com");

        Mockito.when(petRepository.findById(10L))
            .thenReturn(Optional.of(p));

        mockMvc.perform(delete("/api/pets/10")
            .principal(mockPrincipal("test@example.com"))
        ).andExpect(status().isForbidden());
    }
}
