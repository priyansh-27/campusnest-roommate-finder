package com.campusnest.controller;

import com.campusnest.entity.Accommodation;
import com.campusnest.repository.AccommodationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/accommodations")
@RequiredArgsConstructor
public class AccommodationController {

    private final AccommodationRepository repo;

    @GetMapping
    public List<Accommodation> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Accommodation> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/landlord/{landlordId}")
    public List<Accommodation> getByLandlord(@PathVariable Long landlordId) {
        return repo.findByLandlordId(landlordId);
    }

    @PostMapping
    public Accommodation create(@RequestBody Accommodation acc) {
        if (acc.getSafetyScore() == null) acc.setSafetyScore(85);
        if (acc.getVerified() == null) acc.setVerified(false);
        if (acc.getAvailable() == null) acc.setAvailable(true);
        return repo.save(acc);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Accommodation> verify(@PathVariable Long id) {
        return repo.findById(id).map(acc -> {
            acc.setVerified(true);
            return ResponseEntity.ok(repo.save(acc));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "id", id));
    }
}
