package com.swiftmove.clientservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateMoveRequestDto {
    private Instant moveDate;
    private Long maxBudget;
    private Long clientId;
    private Long fromAddressId;
    private Long toAddressId;
    private Double distance;
    private Double fromLatitude;
    private Double fromLongitude;
    private Double toLatitude;
    private Double toLongitude;
    private String status;
    private Boolean hasFurniture;
    private String note;
}
