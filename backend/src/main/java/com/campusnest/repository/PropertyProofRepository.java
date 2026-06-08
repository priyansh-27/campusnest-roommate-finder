package com.campusnest.repository;

import com.campusnest.entity.PropertyProof;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyProofRepository extends JpaRepository<PropertyProof, Long> {
    List<PropertyProof> findByLandlordIdOrderByUploadedAtDesc(Long landlordId);
    List<PropertyProof> findByStatusOrderByUploadedAtDesc(PropertyProof.Status status);
    List<PropertyProof> findAllByOrderByUploadedAtDesc();
    long countByStatus(PropertyProof.Status status);
    long countByLandlordIdAndStatus(Long landlordId, PropertyProof.Status status);
}
