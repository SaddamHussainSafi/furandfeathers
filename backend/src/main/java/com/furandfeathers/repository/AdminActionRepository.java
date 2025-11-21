package com.furandfeathers.repository;

import com.furandfeathers.model.AdminAction;
import com.furandfeathers.enums.ActionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminActionRepository extends JpaRepository<AdminAction, Long> {

    Page<AdminAction> findByPerformedByIdOrderByTimestampDesc(Long userId, Pageable pageable);

    Page<AdminAction> findByActionTypeOrderByTimestampDesc(ActionType actionType, Pageable pageable);

    @Query("SELECT a FROM AdminAction a WHERE a.timestamp BETWEEN ?1 AND ?2 ORDER BY a.timestamp DESC")
    List<AdminAction> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM AdminAction a ORDER BY a.timestamp DESC")
    Page<AdminAction> findAllOrderByTimestampDesc(Pageable pageable);
}