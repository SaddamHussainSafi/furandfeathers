package com.furandfeathers.repository;

import com.furandfeathers.entity.User;
import com.furandfeathers.enums.UserRole;
import com.furandfeathers.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // NEW METHODS FOR ADMIN PANEL
    Long countByRole(UserRole role);

    Long countByStatus(UserStatus status);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = ?1 AND u.status = ?2")
    Long countByRoleAndStatus(UserRole role, UserStatus status);

    @Query("SELECT u FROM User u WHERE u.role = ?1 ORDER BY u.createdAt DESC")
    List<User> findByRoleOrderByCreatedAtDesc(UserRole role);

    List<User> findByRole(UserRole role);
}
