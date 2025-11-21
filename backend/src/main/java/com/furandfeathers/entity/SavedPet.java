package com.furandfeathers.entity;

import com.furandfeathers.entity.User;
import com.furandfeathers.entity.Pet;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_pets")
public class SavedPet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "saved_at", nullable = false)
    private LocalDateTime savedAt = LocalDateTime.now();

    // Constructors
    public SavedPet() {}

    public SavedPet(User user, Pet pet) {
        this.user = user;
        this.pet = pet;
        this.savedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }

    public LocalDateTime getSavedAt() { return savedAt; }
    public void setSavedAt(LocalDateTime savedAt) { this.savedAt = savedAt; }
}