package com.swiftMove.clientManagement_service.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MoveRequestDTO {
    private Long id;
    private LocalDate moveDate;
    private Long maxBudget;
    private Long clientId;
    private Long fromAddressId;
    private Long toAddressId;
    private String status;
}
