package com.campusnest.controller;

import com.campusnest.entity.Subscription;
import com.campusnest.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionRepository repo;

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<?> getActive(@PathVariable Long landlordId) {
        return repo.findByLandlordIdAndActiveTrue(landlordId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(Map.of("active", false)));
    }

    @PostMapping
    public Subscription subscribe(@RequestBody Map<String, Object> body) {
        Long landlordId = Long.valueOf(body.get("landlordId").toString());
        String planStr = body.get("plan").toString().toLowerCase();
        Subscription.Plan plan = Subscription.Plan.valueOf(planStr);

        // Deactivate previous
        repo.findByLandlordIdAndActiveTrue(landlordId).ifPresent(prev -> {
            prev.setActive(false);
            repo.save(prev);
        });

        BigDecimal price = switch (plan) {
            case starter -> new BigDecimal("999.00");
            case growth -> new BigDecimal("1999.00");
            case pro -> new BigDecimal("3999.00");
        };

        Subscription sub = Subscription.builder()
                .landlordId(landlordId)
                .plan(plan)
                .price(price)
                .startsAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMonths(1))
                .active(true)
                .build();
        return repo.save(sub);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        return repo.findById(id).map(s -> {
            s.setActive(false);
            repo.save(s);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
