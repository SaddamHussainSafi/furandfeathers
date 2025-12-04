package com.furandfeathers.dto.furly;

public class FurlyRecommendation {
    private Long id;
    private String name;
    private String breed;
    private String age;
    private String imageUrl;
    private String url;
    private String summary;

    public FurlyRecommendation(Long id, String name, String breed, String age, String imageUrl, String url, String summary) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.imageUrl = imageUrl;
        this.url = url;
        this.summary = summary;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBreed() {
        return breed;
    }

    public String getAge() {
        return age;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getUrl() {
        return url;
    }

    public String getSummary() {
        return summary;
    }
}
