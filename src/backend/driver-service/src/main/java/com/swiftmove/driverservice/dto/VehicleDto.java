package com.swiftmove.driverservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleDto {
    private Long id;
    private String model;
    private String make;
    private Integer year;
    private String color;
    private Long pricePerKm;
    private Boolean isActive;
    private Boolean canCarryFurniture;
    private Long driverInfoId;
    private Long vehicleTypeId;
}
