package com.swiftMove.clientManagement_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "move_request")
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
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
