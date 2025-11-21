package com.furandfeathers.dto;

public class PetResponse {
    public Long id;
    public String name;
    public String species;
    public String breed;
    public String age;
    public String gender;
    public String location;
    public String description;
    public String status;
    public String imageUrl;
    public String imagePath;
    public String listingStatus;
    public OwnerDTO owner;
    public Long likesCount;
    public Boolean liked;
    public Boolean isSaved;

    public PetResponse() {}

    public PetResponse(Long id, String name, String species, String breed, String age, String gender, String location, String description, String status, String imageUrl, String imagePath, String listingStatus, OwnerDTO owner, Long likesCount, Boolean liked, Boolean isSaved) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.gender = gender;
        this.location = location;
        this.description = description;
        this.status = status;
        this.imageUrl = imageUrl;
        this.imagePath = imagePath;
        this.listingStatus = listingStatus;
        this.owner = owner;
        this.likesCount = likesCount;
        this.liked = liked;
        this.isSaved = isSaved;
    }
}
