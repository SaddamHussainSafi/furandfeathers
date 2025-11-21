package com.furandfeathers.entity;

import com.furandfeathers.enums.ListingStatus;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String species;
    private String breed;
    private String age;
    private String gender;
    private String location;

    @Column(length = 1000)
    private String description;

    private String status;
    private String imageUrl;   // optional
    private String imagePath;  // local uploads

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_status")
    @Builder.Default
    private ListingStatus listingStatus = ListingStatus.APPROVED;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility")
    @Builder.Default
    private Visibility visibility = Visibility.PUBLIC;

    @Column(name = "views")
    @Builder.Default
    private Integer views = 0;

    @Column(name = "likes_count")
    @Builder.Default
    private Integer likesCount = 0;

    @Column(name = "saves_count")
    @Builder.Default
    private Integer savesCount = 0;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "adopted_at")
    private LocalDateTime adoptedAt;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "owner_id")   // foreign key
    @JsonBackReference
    private User owner;

    public enum Visibility {
        PUBLIC, PRIVATE
    }
}
