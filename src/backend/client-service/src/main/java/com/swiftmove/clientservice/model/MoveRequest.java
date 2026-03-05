package com.swiftmove.clientservice.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "move_requests")
public class MoveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "move_date")
    private LocalDateTime moveDate;
    @Column(name = "max_budget")
    private Long maxBudget;
    @Column(name = "client_id")
    private Long clientId;
    @Column(name = "from_address_id")
    private Long fromAddressId;
    @Column(name = "to_address_id")
    private Long toAddressId;
    @Column(name = "status")
    private String status;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
//    @Transient
//    private List<MoveOfferDto> moveOffers;
    // @Transient
    // private List<LuggageEntry> luggageEntries;

}
