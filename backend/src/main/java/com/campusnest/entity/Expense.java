package com.campusnest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 50)
    private String category;

    @Column(name = "paid_by_id")
    private Long paidById;

    @Column(name = "paid_by_name", length = 100)
    private String paidByName;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.pending;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> participants = new ArrayList<>();

    @Column(name = "split_amount", precision = 10, scale = 2)
    private BigDecimal splitAmount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (date == null) date = LocalDate.now();
        if (status == null) status = Status.pending;
        if (participants != null && !participants.isEmpty() && amount != null) {
            this.splitAmount = amount.divide(BigDecimal.valueOf(participants.size()), 2, java.math.RoundingMode.HALF_UP);
        }
    }

    public enum Status {
        pending, settled
    }
}
