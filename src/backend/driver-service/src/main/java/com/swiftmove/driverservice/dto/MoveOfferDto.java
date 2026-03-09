package com.swiftmove.driverservice.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MoveOfferDto {
    private Long id;
    private Long price;
    private Instant offerDate;
    private Long moveRequestId;
    private Long driverId;
    private Long vehicleId;
    private String status;
}
