package com.swiftmove.driverservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateVehicleDto {

    private String model;
    private String make;
    private Integer year;
    private String color;
    private Long pricePerKm;
    private Boolean isActive;
    private Boolean canCarryFurniture;
    private Long driverId;
    private Long vehicleTypeId;
}
