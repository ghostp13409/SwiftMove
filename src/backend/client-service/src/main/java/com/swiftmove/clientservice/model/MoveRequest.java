package com.swiftmove.clientservice.model;

import com.swiftmove.clientservice.dto.MoveOfferDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

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
    private LocalDate moveDate;
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
    @Column(name = "created_at")
    private LocalDate createdAt;
    @Column(name = "updated_at")
    private LocalDate updatedAt;
    @Transient
    private List<MoveOfferDto> moveOffers;
    @Transient
    private List<LuggageEntry> luggageEntries;

}
