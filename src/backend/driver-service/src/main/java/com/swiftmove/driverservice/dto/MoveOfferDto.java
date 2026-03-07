package com.swiftmove.driverservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MoveOfferDto {
    private Long id;
    private Long price;
    private Instant offeredDate;
    private Long moveRequestId;
    private Long driverId;
    private Long vehicleId;
    private String status;
}
