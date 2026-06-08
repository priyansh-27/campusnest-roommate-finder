package com.campusnest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_proofs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyProof {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "landlord_id", nullable = false)
    private Long landlordId;

    @Column(name = "landlord_name", length = 100)
    private String landlordName;

    @Column(name = "property_title", length = 200)
    private String propertyTitle;

    @Column(name = "property_id")
    private Long propertyId; // null until linked to a listing

    @Enumerated(EnumType.STRING)
    @Column(name = "proof_type", nullable = false, length = 50)
    private ProofType proofType;

    @Column(name = "document_number", length = 100)
    private String documentNumber;

    @Column(name = "issue_date", length = 50)
    private String issueDate;

    @Column(name = "issuing_authority", length = 200)
    private String issuingAuthority;

    // Base64 encoded image (small files only, demo purpose)
    @Lob
    @Column(name = "document_data", columnDefinition = "TEXT")
    private String documentData;

    @Column(name = "file_name", length = 200)
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.pending;

    @Column(name = "review_notes", columnDefinition = "TEXT")
    private String reviewNotes;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    public void onCreate() {
        if (uploadedAt == null) uploadedAt = LocalDateTime.now();
        if (status == null) status = Status.pending;
    }

    public enum ProofType {
        ELECTRICITY_BILL,
        PROPERTY_DEED,
        TAX_RECEIPT,
        RENTAL_AGREEMENT,
        AADHAAR_CARD,
        WATER_BILL,
        GAS_CONNECTION,
        SOCIETY_NOC
    }

    public enum Status {
        pending,
        approved,
        rejected
    }
}
