package com.swiftmove.clientservice.dto.requestDto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MoveRequestDto {
    private Long id;
    private Instant moveDate;
    private Long maxBudget;
    private Long clientId;
    private Long fromAddressId;
    private Long toAddressId;
    private String status;
}
