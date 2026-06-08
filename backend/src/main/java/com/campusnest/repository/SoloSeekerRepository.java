package com.campusnest.repository;

import com.campusnest.entity.SoloSeeker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SoloSeekerRepository extends JpaRepository<SoloSeeker, Long> {
    List<SoloSeeker> findAllByOrderByCreatedAtDesc();
}
