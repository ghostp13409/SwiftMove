package com.swiftmove.driverservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateMoveOfferDto {

    private Long price;
    private LocalDateTime offeredDate;
    private Long moveRequestId;
    private Long driverId;
    private Long vehicleId;
    private String status;
}
