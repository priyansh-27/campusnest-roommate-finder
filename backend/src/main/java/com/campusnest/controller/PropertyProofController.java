package com.campusnest.controller;

import com.campusnest.entity.PropertyProof;
import com.campusnest.repository.PropertyProofRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/proofs")
@RequiredArgsConstructor
public class PropertyProofController {

    private final PropertyProofRepository repo;

    @GetMapping
    public List<PropertyProof> getAll() {
        return repo.findAllByOrderByUploadedAtDesc();
    }

    @GetMapping("/pending")
    public List<PropertyProof> getPending() {
        return repo.findByStatusOrderByUploadedAtDesc(PropertyProof.Status.pending);
    }

    @GetMapping("/landlord/{landlordId}")
    public List<PropertyProof> getByLandlord(@PathVariable Long landlordId) {
        return repo.findByLandlordIdOrderByUploadedAtDesc(landlordId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyProof> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> upload(@RequestBody PropertyProof proof) {
        try {
            // Validate required fields
            if (proof.getLandlordId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "landlordId required"));
            }
            if (proof.getProofType() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "proofType required"));
            }
            if (proof.getDocumentData() == null || proof.getDocumentData().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "documentData required (base64 image)"));
            }

            proof.setStatus(PropertyProof.Status.pending);
            PropertyProof saved = repo.save(proof);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<PropertyProof> approve(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return repo.findById(id).map(p -> {
            p.setStatus(PropertyProof.Status.approved);
            p.setReviewedAt(LocalDateTime.now());
            if (body != null) {
                p.setReviewedBy(body.getOrDefault("reviewedBy", "Admin"));
                p.setReviewNotes(body.getOrDefault("reviewNotes", "Approved after document verification"));
            }
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<PropertyProof> reject(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return repo.findById(id).map(p -> {
            p.setStatus(PropertyProof.Status.rejected);
            p.setReviewedAt(LocalDateTime.now());
            if (body != null) {
                p.setReviewedBy(body.getOrDefault("reviewedBy", "Admin"));
                p.setReviewNotes(body.getOrDefault("reviewNotes", "Document not clear or invalid"));
            }
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/landlord/{landlordId}/status")
    public Map<String, Object> getStatus(@PathVariable Long landlordId) {
        long approved = repo.countByLandlordIdAndStatus(landlordId, PropertyProof.Status.approved);
        long pending = repo.countByLandlordIdAndStatus(landlordId, PropertyProof.Status.pending);
        long rejected = repo.countByLandlordIdAndStatus(landlordId, PropertyProof.Status.rejected);
        return Map.of(
            "approved", approved,
            "pending", pending,
            "rejected", rejected,
            "canListProperty", approved > 0
        );
    }
}
