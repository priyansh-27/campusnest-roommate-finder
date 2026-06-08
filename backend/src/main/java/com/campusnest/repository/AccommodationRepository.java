package com.campusnest.repository;

import com.campusnest.entity.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    List<Accommodation> findByLandlordId(Long landlordId);
    List<Accommodation> findByVerifiedTrue();
    long countByVerifiedFalse();
}
