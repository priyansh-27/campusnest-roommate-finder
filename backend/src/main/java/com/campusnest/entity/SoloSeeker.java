package com.campusnest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solo_seekers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoloSeeker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", length = 100)
    private String userName;

    @Column(name = "user_avatar", columnDefinition = "TEXT")
    private String userAvatar;

    @Column(name = "flat_name", length = 200)
    private String flatName;

    @Column(length = 50)
    private String city;

    @Column(length = 100)
    private String area;

    @Column(name = "rent_per_head", precision = 10, scale = 2)
    private BigDecimal rentPerHead;

    @Column(name = "rooms_available")
    private Integer roomsAvailable = 1;

    @Column(name = "move_in_date", length = 50)
    private String moveInDate;

    @Column(name = "staying_since", length = 50)
    private String stayingSince;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> preferences = new ArrayList<>();

    @Column(nullable = false)
    private Boolean verified = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (verified == null) verified = false;
        if (roomsAvailable == null) roomsAvailable = 1;
    }
}
