package com.campusnest.controller;

import com.campusnest.entity.Accommodation;
import com.campusnest.entity.MaintenanceRequest;
import com.campusnest.repository.AccommodationRepository;
import com.campusnest.repository.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceRepository repo;
    private final AccommodationRepository accRepo;

    @GetMapping
    public List<MaintenanceRequest> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/landlord/{landlordId}")
    public List<MaintenanceRequest> getByLandlord(@PathVariable Long landlordId) {
        List<Long> propIds = accRepo.findByLandlordId(landlordId).stream().map(Accommodation::getId).toList();
        if (propIds.isEmpty()) return List.of();
        return repo.findByPropertyIdIn(propIds);
    }

    @GetMapping("/tenant/{tenantId}")
    public List<MaintenanceRequest> getByTenant(@PathVariable Long tenantId) {
        return repo.findByTenantId(tenantId);
    }

    @PostMapping
    public MaintenanceRequest create(@RequestBody MaintenanceRequest req) {
        if (req.getStatus() == null) req.setStatus(MaintenanceRequest.Status.open);
        if (req.getPriority() == null) req.setPriority(MaintenanceRequest.Priority.medium);
        return repo.save(req);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MaintenanceRequest> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repo.findById(id).map(r -> {
            try {
                r.setStatus(MaintenanceRequest.Status.valueOf(body.get("status")));
            } catch (Exception ignored) {}
            return ResponseEntity.ok(repo.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }
}
