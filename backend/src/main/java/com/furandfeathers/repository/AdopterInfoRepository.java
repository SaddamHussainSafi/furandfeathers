package com.furandfeathers.repository;

import com.furandfeathers.model.AdopterInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdopterInfoRepository extends JpaRepository<AdopterInfo, Long> {

    Optional<AdopterInfo> findByUserId(Long userId);
}