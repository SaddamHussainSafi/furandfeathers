package com.furandfeathers.repository;

import com.furandfeathers.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPetIdOrderByCreatedAtDesc(Long petId);
}