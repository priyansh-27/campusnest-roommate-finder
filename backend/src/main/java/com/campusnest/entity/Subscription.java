package com.campusnest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "landlord_id", nullable = false)
    private Long landlordId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Plan plan;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "starts_at")
    private LocalDateTime startsAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean active = true;

    @PrePersist
    public void onCreate() {
        if (startsAt == null) startsAt = LocalDateTime.now();
        if (expiresAt == null) expiresAt = startsAt.plusMonths(1);
        if (active == null) active = true;
    }

    public enum Plan {
        starter, growth, pro
    }
}
