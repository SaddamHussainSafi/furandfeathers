package com.furandfeathers.entity;

import com.furandfeathers.enums.UserRole;
import com.furandfeathers.enums.UserStatus;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String provider; // "local" or "google"

    @com.fasterxml.jackson.annotation.JsonIgnore
    public String getPassword() { return password; }
    @com.fasterxml.jackson.annotation.JsonIgnore
    public String getProvider() { return provider; }
    private String picture;

    @Enumerated(EnumType.STRING)
    private UserRole role; // SUPERADMIN, ADMIN, SHELTER, ADOPTER

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "is_system_protected")
    @Builder.Default
    private Boolean isSystemProtected = false;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "phone")
    private String phone;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "date_of_birth")
    private java.sql.Date dateOfBirth;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "country")
    private String country;

    @Column(name = "zip_code")
    private String zipCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "profile_visibility")
    @Builder.Default
    private ProfileVisibility profileVisibility = ProfileVisibility.PUBLIC;

    @Column(name = "email_notifications")
    @Builder.Default
    private Boolean emailNotifications = true;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Pet> pets = new ArrayList<>();

    public enum ProfileVisibility {
        PUBLIC, PRIVATE
    }
}
