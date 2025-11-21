package com.furandfeathers.service;

import com.furandfeathers.dto.OwnerDTO;
import com.furandfeathers.dto.PetResponse;
import com.furandfeathers.entity.Pet;
import com.furandfeathers.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PetRecommendationService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private DeepseekDatasetService datasetService;

    public List<PetResponse> getRecommendations(String homeType, String activityLevel, String personality) {
        String key = homeType.toLowerCase() + "_" + activityLevel.toLowerCase() + "_" + personality.toLowerCase();

        Map<String, List<String>> recommendations = datasetService.getDataset().getPetRecommendations();
        List<String> breeds = recommendations.get(key);

        if (breeds == null || breeds.isEmpty()) {
            // Fallback to all available pets
            List<Pet> allPets = petRepository.findByStatus("Available");
            return allPets.stream().limit(3).map(this::convertToResponse).collect(Collectors.toList());
        }

        List<Pet> matchedPets = new ArrayList<>();
        for (String breed : breeds) {
            List<Pet> pets = petRepository.findByBreedIgnoreCaseAndStatus(breed, "Available");
            matchedPets.addAll(pets);
        }

        // If less than 3, add more from available pets
        if (matchedPets.size() < 3) {
            List<Pet> additionalPets = petRepository.findByStatus("Available").stream()
                    .filter(p -> !matchedPets.contains(p))
                    .limit(3 - matchedPets.size())
                    .collect(Collectors.toList());
            matchedPets.addAll(additionalPets);
        }

        // Rank by exact breed match first, then others
        matchedPets.sort((p1, p2) -> {
            boolean p1Match = breeds.stream().anyMatch(b -> b.equalsIgnoreCase(p1.getBreed()));
            boolean p2Match = breeds.stream().anyMatch(b -> b.equalsIgnoreCase(p2.getBreed()));
            if (p1Match && !p2Match) return -1;
            if (!p1Match && p2Match) return 1;
            return 0;
        });

        return matchedPets.stream().limit(3).map(this::convertToResponse).collect(Collectors.toList());
    }

    private PetResponse convertToResponse(Pet pet) {
        OwnerDTO ownerDTO = null;
        if (pet.getOwner() != null) {
            ownerDTO = new OwnerDTO(pet.getOwner().getId(), pet.getOwner().getName(), pet.getOwner().getEmail(), pet.getOwner().getPicture());
        }
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
            ownerDTO,
            null, // likesCount
            false, // liked
            false // isSaved
        );
    }
}