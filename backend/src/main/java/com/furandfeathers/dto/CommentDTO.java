package com.furandfeathers.dto;

import java.time.LocalDateTime;

public class CommentDTO {
    public Long id;
    public String content;
    public LocalDateTime createdAt;
    public OwnerDTO user;

    public CommentDTO() {}

    public CommentDTO(Long id, String content, LocalDateTime createdAt, OwnerDTO user) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.user = user;
    }
}