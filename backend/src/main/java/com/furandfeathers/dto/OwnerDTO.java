package com.furandfeathers.dto;

public class OwnerDTO {
    public Long id;
    public String name;
    public String email;
    public String picture;

    public OwnerDTO() {}

    public OwnerDTO(Long id, String name, String email, String picture) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.picture = picture;
    }
}
