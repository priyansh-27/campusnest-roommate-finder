package com.campusnest.repository;

import com.campusnest.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByPropertyIdIn(List<Long> propertyIds);
    List<MaintenanceRequest> findByTenantId(Long tenantId);
    List<MaintenanceRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(MaintenanceRequest.Status status);
}
