package com.campusnest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private Long tenantId;

    @Column(name = "tenant_name", length = 100)
    private String tenantName;

    @Column(name = "property_id")
    private Long propertyId;

    @Column(name = "property_title", length = 200)
    private String propertyTitle;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String issue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority = Priority.medium;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.open;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDate.now();
        if (priority == null) priority = Priority.medium;
        if (status == null) status = Status.open;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Priority { low, medium, high }
    public enum Status { open, in_progress, resolved }
}
